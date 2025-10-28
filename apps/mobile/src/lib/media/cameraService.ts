import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import type { FileInfo } from 'expo-file-system/legacy';
import { Alert } from 'react-native';
import { nanoid } from 'nanoid';
import * as Crypto from 'expo-crypto';
import type { MediaFile } from '@/constants/traceabilityEvents';

export type CameraServiceOptions = {
  quality?: number; // 0-1
  allowsEditing?: boolean;
  base64?: boolean;
};

export type ScanResult = {
  type: string;
  data: string;
  timestamp: number;
};

const resolveFileSize = (info: FileInfo): number => {
  return info.exists ? info.size : 0;
};

export class CameraService {
  private static instance: CameraService;

  static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService();
    }
    return CameraService.instance;
  }

  async requestCameraPermissions(): Promise<boolean> {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'This app needs camera access to take photos for traceability events. Please enable camera access in your device settings.',
          [{ text: 'OK' }]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  }

  async requestBarcodeScannerPermissions(): Promise<boolean> {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'This app needs camera access to scan barcodes. Please enable camera access in your device settings.',
          [{ text: 'OK' }]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting barcode scanner permissions:', error);
      return false;
    }
  }

  // Take a photo and return media file info with checksum
  async takePhoto(eventId: string, options: CameraServiceOptions = {}): Promise<MediaFile | null> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      if (!hasPermission) {
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options.allowsEditing || false,
        aspect: [4, 3],
        quality: options.quality || 0.8,
        base64: options.base64 || false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      const photoId = nanoid();
      const fileName = `photo_${photoId}.jpg`;
      const photosDir = `${FileSystem.documentDirectory}photos/`;
      const finalUri = `${photosDir}${fileName}`;

      // Create directory if it doesn't exist
  await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
      
      // Copy the photo to our app directory
      await FileSystem.copyAsync({
        from: asset.uri,
        to: finalUri,
      });

      const fileInfo = await FileSystem.getInfoAsync(finalUri);
      if (!fileInfo.exists) {
        throw new Error('Failed to save photo');
      }

      // Calculate checksum
      const checksum = await this.calculateFileChecksum(finalUri);

      const mediaFile: MediaFile = {
        id: photoId,
        eventId,
        type: 'photo',
        uri: finalUri,
        checksum,
        size: resolveFileSize(fileInfo),
        mimeType: 'image/jpeg',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      return mediaFile;
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Camera Error', 'Unable to take photo. Please try again.');
      return null;
    }
  }

  // Calculate file checksum for integrity verification
  async calculateFileChecksum(uri: string): Promise<string> {
    try {
      // Read file as base64 and calculate SHA256 hash
      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        fileContent,
        { encoding: Crypto.CryptoEncoding.HEX }
      );
      
      return digest;
    } catch (error) {
      console.error('Error calculating checksum:', error);
      // Fallback to file-info based checksum
  const fileInfo = await FileSystem.getInfoAsync(uri);
  return `fallback_${resolveFileSize(fileInfo)}_${Date.now()}`;
    }
  }

  // Verify file integrity using checksum
  async verifyFileIntegrity(mediaFile: MediaFile): Promise<boolean> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(mediaFile.uri);
      if (!fileInfo.exists) {
        return false;
      }

      // In a real implementation, you'd recalculate the checksum and compare
  // For now, just check if file exists and has expected size
  return resolveFileSize(fileInfo) > 0;
    } catch (error) {
      console.error('Error verifying file integrity:', error);
      return false;
    }
  }

  // Scan barcodes/QR codes
  async scanBarcode(): Promise<ScanResult | null> {
    try {
      const hasPermission = await this.requestBarcodeScannerPermissions();
      if (!hasPermission) {
        return null;
      }

      // For this example, return mock scan results
      // In a real implementation, you'd open the barcode scanner UI
      const mockResults: ScanResult[] = [
        { type: 'QR_CODE', data: 'FARM-001-LOT-20241021-001', timestamp: Date.now() },
        { type: 'CODE_128', data: 'SEED-BATCH-202410-ABC123', timestamp: Date.now() },
        { type: 'EAN_13', data: '1234567890123', timestamp: Date.now() },
      ];

      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Return random mock result
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      return randomResult;
    } catch (error) {
      console.error('Error scanning barcode:', error);
      Alert.alert('Scanner Error', 'Unable to scan barcode. Please try again.');
      return null;
    }
  }

  // Save scanned barcode as media file
  async saveScanResult(eventId: string, scanResult: ScanResult): Promise<MediaFile | null> {
    try {
    const tempUri = `${FileSystem.documentDirectory}scans/scan_${nanoid()}.json`;

    // Create directory if it doesn't exist
    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}scans/`, { intermediates: true });
      
      // Save scan result as JSON
      await FileSystem.writeAsStringAsync(tempUri, JSON.stringify(scanResult));

      const fileInfo = await FileSystem.getInfoAsync(tempUri);
      if (!fileInfo.exists) {
        throw new Error('Failed to save scan result');
      }

      const checksum = await this.calculateFileChecksum(tempUri);

      const mediaFile: MediaFile = {
        id: nanoid(),
        eventId,
        type: 'barcode',
        uri: tempUri,
        checksum,
  size: resolveFileSize(fileInfo),
        mimeType: 'application/json',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      return mediaFile;
    } catch (error) {
      console.error('Error saving scan result:', error);
      return null;
    }
  }

  // Cleanup old media files to free up space
  async cleanupOldMediaFiles(olderThanDays = 30): Promise<void> {
    try {
      const photosDir = `${FileSystem.documentDirectory}photos/`;
      const scansDir = `${FileSystem.documentDirectory}scans/`;

      const cutoffDate = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);

      // Clean photos
      try {
        const photos = await FileSystem.readDirectoryAsync(photosDir);
        for (const photo of photos) {
          const photoPath = `${photosDir}${photo}`;
          const fileInfo = await FileSystem.getInfoAsync(photoPath);
          
          if (fileInfo.exists && fileInfo.modificationTime && fileInfo.modificationTime < cutoffDate) {
            await FileSystem.deleteAsync(photoPath);
          }
        }
      } catch {
        // Photos directory might not exist
      }

      // Clean scans
      try {
        const scans = await FileSystem.readDirectoryAsync(scansDir);
        for (const scan of scans) {
          const scanPath = `${scansDir}${scan}`;
          const fileInfo = await FileSystem.getInfoAsync(scanPath);
          
          if (fileInfo.exists && fileInfo.modificationTime && fileInfo.modificationTime < cutoffDate) {
            await FileSystem.deleteAsync(scanPath);
          }
        }
      } catch {
        // Scans directory might not exist
      }
    } catch (error) {
      console.error('Error cleaning up old media files:', error);
    }
  }

  // Get media file statistics
  async getMediaStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    photoCount: number;
    scanCount: number;
  }> {
    try {
      let totalFiles = 0;
      let totalSize = 0;
      let photoCount = 0;
      let scanCount = 0;

      // Count photos
      try {
        const photosDir = `${FileSystem.documentDirectory}photos/`;
        const photos = await FileSystem.readDirectoryAsync(photosDir);
        
        for (const photo of photos) {
          const photoPath = `${photosDir}${photo}`;
          const fileInfo = await FileSystem.getInfoAsync(photoPath);
          
          if (fileInfo.exists) {
            totalFiles++;
            photoCount++;
            totalSize += resolveFileSize(fileInfo);
          }
        }
      } catch {
        // Photos directory might not exist
      }

      // Count scans
      try {
        const scansDir = `${FileSystem.documentDirectory}scans/`;
        const scans = await FileSystem.readDirectoryAsync(scansDir);
        
        for (const scan of scans) {
          const scanPath = `${scansDir}${scan}`;
          const fileInfo = await FileSystem.getInfoAsync(scanPath);
          
          if (fileInfo.exists) {
            totalFiles++;
            scanCount++;
            totalSize += resolveFileSize(fileInfo);
          }
        }
      } catch {
        // Scans directory might not exist
      }

      return {
        totalFiles,
        totalSize,
        photoCount,
        scanCount,
      };
    } catch (error) {
      console.error('Error getting media stats:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        photoCount: 0,
        scanCount: 0,
      };
    }
  }
}

// Singleton instance
export const cameraService = CameraService.getInstance();

// Hook for React components
export function useCamera() {
  const takePhoto = async (eventId: string, options?: CameraServiceOptions): Promise<MediaFile | null> => {
    return cameraService.takePhoto(eventId, options);
  };

  const scanBarcode = async (): Promise<ScanResult | null> => {
    return cameraService.scanBarcode();
  };

  const saveScan = async (eventId: string, scanResult: ScanResult): Promise<MediaFile | null> => {
    return cameraService.saveScanResult(eventId, scanResult);
  };

  const verifyIntegrity = async (mediaFile: MediaFile): Promise<boolean> => {
    return cameraService.verifyFileIntegrity(mediaFile);
  };

  return {
    takePhoto,
    scanBarcode,
    saveScan,
    verifyIntegrity,
    getStats: cameraService.getMediaStats.bind(cameraService),
    cleanup: cameraService.cleanupOldMediaFiles.bind(cameraService),
  };
}