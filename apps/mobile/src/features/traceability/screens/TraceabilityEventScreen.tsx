import { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Switch,
} from 'react-native';
import { nanoid } from 'nanoid';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import { useCamera } from '@/lib/media/cameraService';
import { useQRCode } from '@/lib/media/qrCodeService';
import { useLocation as useLocationService } from '@/lib/location/locationService';

import {
  EVENT_CONFIGS,
  type TraceabilityEvent,
  type TraceabilityEventType,
  type MediaFile,
  type LocationData,
} from '@/constants/traceabilityEvents';
import type { JourneyStackParamList } from '@/navigation/types';

type TraceabilityEventScreenProps = NativeStackScreenProps<
  JourneyStackParamList,
  'TraceabilityEvent'
>;

export const TraceabilityEventScreen = ({ route, navigation }: TraceabilityEventScreenProps) => {
  const theme = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const { getCurrentLocation, formatLocation, isAccurate } = useLocationService();
  const { takePhoto, scanBarcode, saveScan } = useCamera();
  const { generateQRCode } = useQRCode();
  
  const { eventType } = route.params as { eventType: TraceabilityEventType };
  const config = EVENT_CONFIGS[eventType];

  // Form state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Media state
  const [photos, setPhotos] = useState<MediaFile[]>([]);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [qrCode, setQRCode] = useState<MediaFile | null>(null);

  // Location state
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [useLocation, setUseLocation] = useState(config.requiresLocation);

  const loadCurrentLocation = useCallback(async () => {
    setLocationLoading(true);
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      
      if (location && !isAccurate(location)) {
        Alert.alert(
          'Location Accuracy Warning',
          `GPS accuracy is ${location.accuracy?.toFixed(0)}m. For better traceability, try moving to an open area.`,
          [{ text: 'Continue Anyway' }, { text: 'Retry', onPress: loadCurrentLocation }]
        );
      }
    } catch (error) {
      console.error('Error loading location:', error);
      Alert.alert('Location Error', 'Could not get current location. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  }, [getCurrentLocation, isAccurate]);

  useEffect(() => {
    if (config.requiresLocation) {
      loadCurrentLocation();
    }
  }, [config.requiresLocation, loadCurrentLocation]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTakePhoto = async () => {
    const eventId = nanoid();
    const photo = await takePhoto(eventId);
    
    if (photo) {
      setPhotos(prev => [...prev, photo]);
      Alert.alert('Success', 'Photo captured and verified');
    }
  };

  const handleScanBarcode = async () => {
    const result = await scanBarcode();
    
    if (result) {
      setScannedData(result.data);
      const eventId = nanoid();
      const scanFile = await saveScan(eventId, result);
      
      if (scanFile) {
        Alert.alert('Barcode Scanned', `Scanned: ${result.data}`);
      }
    }
  };

  const handleGenerateQR = async () => {
    if (!currentLocation) {
      Alert.alert('Location Required', 'GPS location is required to generate QR codes');
      return;
    }

    // Create a mock event for QR generation
    const mockEvent: TraceabilityEvent = {
      id: nanoid(),
      type: eventType,
      actorRole: user?.role || 'farmer',
      actorId: user?.id || 'unknown',
      payload: formData,
      occurredAt: new Date().toISOString(),
      location: currentLocation,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const qr = await generateQRCode(mockEvent);
    
    if (qr) {
      setQRCode(qr);
      Alert.alert('Success', 'QR code generated for traceability');
    }
  };

  const validateForm = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check required fields
    for (const field of config.requiredFields) {
      if (!formData[field]) {
        errors.push(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
      }
    }

    // Check location requirement
    if (config.requiresLocation && useLocation && !currentLocation) {
      errors.push('GPS location is required for this event');
    }

    // Check photo requirement
    if (config.requiresPhoto && photos.length === 0) {
      errors.push('At least one photo is required for this event');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  const handleSubmit = async () => {
    const validation = validateForm();
    
    if (!validation.valid) {
      Alert.alert('Form Incomplete', validation.errors.join('\n'));
      return;
    }

    setLoading(true);
    try {
      const eventId = nanoid();
      
      const event: TraceabilityEvent = {
        id: eventId,
        type: eventType,
        actorRole: user?.role || 'farmer',
        actorId: user?.id || 'unknown',
        payload: formData,
        occurredAt: new Date().toISOString(),
        location: useLocation ? currentLocation ?? undefined : undefined,
        notes: notes.trim() || undefined,
        mediaIds: photos.map(p => p.id),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In a real app, you'd save this to the local database
      console.log('Saving event:', event);
      console.log('Photos:', photos);
      console.log('QR Code:', qrCode);

      Alert.alert(
        'Event Saved',
        'Traceability event saved locally and will sync when online.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert('Save Error', 'Unable to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderFormField = (field: string) => {
    const isRequired = config.requiredFields.includes(field);
    const label = field.replace(/([A-Z])/g, ' $1').toLowerCase();
    const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);

    // Special handling for specific field types
    if (field.includes('Date')) {
      return (
        <TextField
          key={field}
          label={`${capitalizedLabel}${isRequired ? ' *' : ''}`}
          value={formData[field] || ''}
          onChangeText={(value: string) => handleInputChange(field, value)}
          placeholder="YYYY-MM-DD"
          keyboardType="numeric"
        />
      );
    }

    if (field.includes('quantity') || field.includes('rate') || field.includes('size')) {
      return (
        <TextField
          key={field}
          label={`${capitalizedLabel}${isRequired ? ' *' : ''}`}
          value={formData[field] || ''}
          onChangeText={(value: string) => handleInputChange(field, value)}
          placeholder="Enter number"
          keyboardType="numeric"
        />
      );
    }

    return (
      <TextField
        key={field}
        label={`${capitalizedLabel}${isRequired ? ' *' : ''}`}
        value={formData[field] || ''}
  onChangeText={(value: string) => handleInputChange(field, value)}
        placeholder={`Enter ${label}`}
        multiline={field === 'notes'}
        numberOfLines={field === 'notes' ? 3 : 1}
      />
    );
  };

  const getStepCompletion = () => {
  const requiredFieldsComplete = config.requiredFields.every(field => Boolean(formData[field]));
  const locationComplete = !config.requiresLocation || !useLocation ? true : Boolean(currentLocation);
    const photoComplete = !config.requiresPhoto || photos.length > 0;

    return [
      { id: 'form', label: 'Form', completed: requiredFieldsComplete },
      { id: 'location', label: 'Location', completed: locationComplete },
      { id: 'media', label: 'Media', completed: photoComplete },
    ];
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={[styles.hero, { backgroundColor: theme.colors.primaryMuted }]}>
          <Text style={[theme.typography.caption, styles.heroLabel, { color: theme.colors.primary }]}>
            {config.icon} TRACEABILITY EVENT
          </Text>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            {config.title}
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            {config.description}
          </Text>
        </View>

        {/* Progress */}
        <View style={{ marginBottom: 16 }}>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginBottom: 8 }]}>
            Progress
          </Text>
          <ProgressStepper steps={getStepCompletion()} />
        </View>

        {/* Form Fields */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[theme.typography.subtitle, { color: theme.colors.text, marginBottom: 16 }]}>
            Event Details
          </Text>

          {config.requiredFields.map(renderFormField)}
          {config.optionalFields.map(renderFormField)}

          <TextField
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional notes or observations..."
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Location Section */}
        {config.requiresLocation && (
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Text style={[theme.typography.subtitle, { color: theme.colors.text, marginBottom: 16 }]}>
              GPS Location
            </Text>

            <View style={styles.switchRow}>
              <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                Include GPS coordinates
              </Text>
              <Switch
                value={useLocation}
                onValueChange={setUseLocation}
                trackColor={{ false: theme.colors.border, true: theme.colors.primaryMuted }}
                thumbColor={useLocation ? theme.colors.primary : theme.colors.textMuted}
              />
            </View>

            {useLocation && (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <VerificationBadge status={currentLocation && isAccurate(currentLocation) ? 'verified' : 'pending'} />
                  <Text style={[theme.typography.caption, { color: theme.colors.textMuted, flex: 1 }]}>
                    {currentLocation ? formatLocation(currentLocation) : 'No location data'}
                  </Text>
                </View>

                <Button
                  onPress={loadCurrentLocation}
                  loading={locationLoading}
                  variant="outline"
                  size="small"
                  style={{ marginTop: 12 }}
                >
                  📍 Get Current Location
                </Button>
              </>
            )}
          </View>
        )}

        {/* Media Section */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[theme.typography.subtitle, { color: theme.colors.text, marginBottom: 16 }]}>
            Media Capture
          </Text>

          {/* Photo Section */}
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <VerificationBadge status={photos.length > 0 ? 'verified' : config.requiresPhoto ? 'pending' : 'optional'} />
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                📷 Photos ({photos.length})
                {config.requiresPhoto && ' - Required'}
              </Text>
            </View>

            <Button onPress={handleTakePhoto} variant="outline" size="small" fullWidth>
              📷 Take Photo
            </Button>
          </View>

          {/* Barcode Section */}
          {config.allowsBarcode && (
            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <VerificationBadge status={scannedData ? 'verified' : 'optional'} />
                <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                  📊 Barcode/QR Scan
                  {scannedData && `: ${scannedData.substring(0, 20)}...`}
                </Text>
              </View>

              <Button onPress={handleScanBarcode} variant="outline" size="small" fullWidth>
                📊 Scan Barcode
              </Button>
            </View>
          )}

          {/* QR Code Generation */}
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <VerificationBadge status={qrCode ? 'verified' : 'optional'} />
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                🔲 Generate QR Code for traceability
              </Text>
            </View>

            <Button onPress={handleGenerateQR} variant="outline" size="small" fullWidth>
              🔲 Generate QR Code
            </Button>
          </View>
        </View>

        {/* Submit Button */}
        <Button onPress={handleSubmit} loading={loading} fullWidth>
          ✅ Save Event (Works Offline)
        </Button>

        {/* Debug Info */}
        {__DEV__ && (
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              DEBUG INFO
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted, fontFamily: 'monospace' }]}>
              Event: {eventType}{'\n'}
              User: {user?.role || 'unknown'}{'\n'}
              Location: {currentLocation ? 'Available' : 'None'}{'\n'}
              Photos: {photos.length}{'\n'}
              Form Valid: {validateForm().valid ? 'Yes' : 'No'}
            </Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 20,
  },
  hero: {
    borderRadius: 24,
    padding: 24,
    gap: 8,
  },
  heroLabel: {
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});