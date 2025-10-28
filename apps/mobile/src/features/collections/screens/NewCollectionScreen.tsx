import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useAppTheme } from '@/theme/ThemeProvider';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { createCollection } from '@/features/collections/api/collectionsApi';
import { enqueueRest } from '@/lib/offline/restQueue';
import { useOffline } from '@/providers/OfflineProvider';
import { queryKeys } from '@/constants/queryKeys';

export const NewCollectionScreen = () => {
  const theme = useAppTheme();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { isOnline } = useOffline();
  const [commodity, setCommodity] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ commodity?: string; weightKg?: string; pricePerKg?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!commodity.trim()) next.commodity = 'Commodity is required';
    const w = Number(weightKg);
    if (!weightKg.trim() || Number.isNaN(w) || w <= 0) next.weightKg = 'Enter weight in kg';
    const p = Number(pricePerKg);
    if (!pricePerKg.trim() || Number.isNaN(p) || p <= 0) next.pricePerKg = 'Enter price per kg';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        commodity: commodity.trim(),
        weightKg: Number(weightKg),
        pricePerKg: Number(pricePerKg),
        notes: notes.trim() || undefined
      };

      if (!isOnline) {
        await enqueueRest({ method: 'post', url: '/collections', body: payload });
        Alert.alert('Queued', 'Offline: collection will sync when back online');
        navigation.goBack();
        return;
      }

      await createCollection(payload);
      await queryClient.invalidateQueries({ queryKey: queryKeys.collections.all }).catch(() => undefined);
      Alert.alert('Success', 'Collection created');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to create collection');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}> 
        <Text style={[theme.typography.heading, { color: theme.colors.text }]}>New Collection</Text>
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 6 }]}>Enter details below</Text>
        <View style={{ height: 12 }} />
        <TextField label="Commodity" value={commodity} onChangeText={setCommodity} placeholder="e.g. Avocado" error={errors.commodity} />
        <TextField
          label="Weight (kg)"
          value={weightKg}
          onChangeText={setWeightKg}
          keyboardType="numeric"
          placeholder="e.g. 250"
          error={errors.weightKg}
        />
        <TextField
          label="Price per kg"
          value={pricePerKg}
          onChangeText={setPricePerKg}
          keyboardType="numeric"
          placeholder="e.g. 42.5"
          error={errors.pricePerKg}
        />
        <TextField label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional" />
        <View style={{ height: 16 }} />
        <Button onPress={onSubmit} loading={submitting} fullWidth>
          Create
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 12 }
});
