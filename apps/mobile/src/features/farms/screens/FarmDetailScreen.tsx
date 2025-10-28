import { useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { InlineAlert } from '@/components/ui/InlineAlert';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useFarm, useUpdateFarm, useFarmHistory } from '@/features/farms/hooks/useFarms';

export const FarmDetailScreen = ({ route, navigation }: { route: { params?: { id?: string } }; navigation: { setOptions: (_opts: { title?: string }) => void } }) => {
  const theme = useAppTheme();
  const id = route.params?.id as string;
  const { data: farm, isLoading, isError, refetch } = useFarm(id);
  const history = useFarmHistory(id);
  const updateFarm = useUpdateFarm(id);

  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  const formSchema = useMemo(
    () =>
      z.object({
        status: z.string().trim().max(60, 'Status must be 60 characters or fewer'),
        notes: z.string().trim().max(500, 'Notes must be 500 characters or fewer')
      }),
    []
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: farm?.name ?? 'Farm' });
  }, [navigation, farm?.name]);

  useLayoutEffect(() => {
    if (farm) {
      setStatus(farm.status ?? '');
      setNotes(farm.notes ?? '');
      setFeedback(null);
    }
  }, [farm]);

  const onSave = async () => {
    if (!farm) {
      setFeedback({ kind: 'error', message: 'Farm details are unavailable. Please retry.' });
      return;
    }

    const result = formSchema.safeParse({ status, notes });
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? 'Please resolve the highlighted fields.';
      setFeedback({ kind: 'error', message });
      return;
    }

    const payload = {
      status: result.data.status.trim(),
      notes: result.data.notes.trim(),
      note: 'Status/notes updated'
    } as const;

    try {
      setFeedback(null);
      await updateFarm.mutateAsync(payload);
      setFeedback({ kind: 'success', message: 'Farm updated successfully.' });
      void refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update farm. Please try again.';
      setFeedback({ kind: 'error', message });
    }
  };

  const initialStatus = (farm?.status ?? '').trim();
  const initialNotes = (farm?.notes ?? '').trim();
  const trimmedStatus = status.trim();
  const trimmedNotes = notes.trim();
  const isDirty = trimmedStatus !== initialStatus || trimmedNotes !== initialNotes;

  return (
    <Screen>
      <View style={{ gap: 16 }}>
        {isLoading && <ActivityIndicator color={theme.colors.primary} />}
        {isError && (
          <Text style={{ color: theme.colors.error }}>
            Failed to load. <Text onPress={() => void refetch()}>Retry</Text>
          </Text>
        )}

        {farm && (
          <View style={{ gap: 12 }}>
            {feedback && <InlineAlert kind={feedback.kind}>{feedback.message}</InlineAlert>}
            <Text style={{ fontSize: 22, fontWeight: '700', color: theme.colors.text }}>{farm.name}</Text>
            <Text style={{ color: theme.colors.textMuted }}>Location: {farm.location ?? '—'}</Text>

            <View style={{ gap: 8 }}>
              <Text style={{ fontWeight: '600', color: theme.colors.text }}>Status</Text>
              <TextInput
                value={status}
                onChangeText={setStatus}
                placeholder="e.g., active, maintenance, harvesting"
                style={{
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radii.md,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: theme.colors.text
                }}
                maxLength={60}
              />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontWeight: '600', color: theme.colors.text }}>Notes</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Any updates, observations, or tasks..."
                multiline
                numberOfLines={4}
                style={{
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radii.md,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: theme.colors.text
                }}
                maxLength={500}
              />
            </View>

            <Button onPress={() => void onSave()} loading={updateFarm.isPending} disabled={!isDirty}>
              Save
            </Button>

            <View style={{ gap: 8 }}>
              <Text style={{ fontWeight: '700', color: theme.colors.text, marginTop: 12 }}>Recent Updates</Text>
              {(history.data ?? [])
                .slice()
                .reverse()
                .slice(0, 10)
                .map((h, i) => (
                  <Text key={i} style={{ color: theme.colors.textMuted }}>
                    {new Date(h.at).toLocaleString()}: {h.note ?? JSON.stringify(h.change)}
                  </Text>
                ))}
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
};