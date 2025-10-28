import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { getFileInfoWithHash, writeTempDemoFile } from '@/lib/offline/file';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useCapture } from '@/features/capture/context';
import type { JourneyStackParamList } from '@/navigation/types';
import type { CaptureMediaPayload } from '@/features/capture/types';
import type { TraceabilityEventType } from '@/constants/traceabilityEvents';

type CaptureScreenProps = NativeStackScreenProps<JourneyStackParamList, 'Capture'>;
type CaptureScreenContentProps = {
  eventType: TraceabilityEventType;
  stageId: string;
  onClose: () => void;
};

const CaptureScreenContent = ({ eventType, stageId, onClose }: CaptureScreenContentProps) => {
  const theme = useAppTheme();
  const { captureEvent } = useCapture();

  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [attached, setAttached] = useState<{ uri: string; size: number; md5?: string } | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const media: CaptureMediaPayload[] = [];
      if (attached) {
        media.push({
          type: 'photo',
          uri: attached.uri,
          checksum: attached.md5 ?? 'md5-unknown',
          size: attached.size
        });
      }

      await captureEvent(
        {
          type: eventType,
          occurredAt: new Date().toISOString(),
          payload: {
            notes,
            stageId,
            clientId: Math.random().toString(36).slice(2),
            actorRole: 'farmer'
          }
        },
        media
      );

      Alert.alert('Saved', 'Event stored locally and will sync when online.');
      onClose();
    } catch (error) {
      Alert.alert('Unable to save', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.hero, { backgroundColor: theme.colors.primaryMuted }]}> 
          <Text style={[theme.typography.caption, styles.heroLabel, { color: theme.colors.primary }]}>Capture event</Text>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>{eventType}</Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>Stage: {stageId}</Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginBottom: 8 }]}>Steps</Text>
          <ProgressStepper
            steps={[
              { id: 'prepare', label: 'Prepare', completed: true },
              { id: 'capture', label: 'Capture', completed: Boolean(attached) },
              { id: 'review', label: 'Review', completed: false }
            ]}
          />
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}> 
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Status</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <VerificationBadge status={attached ? 'verified' : 'pending'} />
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              {attached ? '📷 Photo added' : '📷 Add a photo'}
            </Text>
          </View>

          <TextField
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Describe what happened..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={{ gap: 12 }}>
          <Button
            onPress={async () => {
              const uri = await writeTempDemoFile('demo media file');
              const info = await getFileInfoWithHash(uri);
              setAttached(info);
              Alert.alert('Attached', `Demo file attached (size: ${info.size} bytes)`);
            }}
            fullWidth
          >
            📷 Take/attach photo
          </Button>

          <Button onPress={handleSubmit} loading={loading} fullWidth>
            ✅ Save (works offline)
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
};

export const CaptureScreen = ({ route, navigation }: CaptureScreenProps) => (
  <CaptureScreenContent
    eventType={route.params.eventType}
    stageId={route.params.stageId}
    onClose={() => navigation.goBack()}
  />
);

export const CaptureTabScreen = () => {
  const navigation = useNavigation();
  const goBack = () => {
    if ('goBack' in navigation && typeof navigation.goBack === 'function') {
      navigation.goBack();
    }
  };

  return (
    <CaptureScreenContent
      eventType="seed_planting"
      stageId="quick_capture"
      onClose={goBack}
    />
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 20
  },
  hero: {
    borderRadius: 24,
    padding: 24,
    gap: 8
  },
  heroLabel: {
    letterSpacing: 1.1,
    textTransform: 'uppercase'
  },
  card: {
    borderRadius: 20,
    padding: 20,
    gap: 16
  }
});
