// import QRCodeSVG from 'react-native-qrcode-svg'; // Not used in mock implementation
import * as FileSystem from 'expo-file-system/legacy';
import { nanoid } from 'nanoid';
import type { FileInfo } from 'expo-file-system/legacy';
import type { MediaFile, TraceabilityEvent } from '@/constants/traceabilityEvents';

const resolveFileSize = (info: FileInfo): number => (info.exists ? info.size : 0);

export type QRCodeData = {
  lotId: string;
  farmerId: string;
  plotId?: string;
  harvestDate: string;
  cropType?: string;
  quality?: string;
  quantity?: number;
  unit?: string;
  expiryDate?: string;
  certifications?: string[];
  traceUrl?: string;
};

export type QRCodeGenerationOptions = {
  size?: number;
  backgroundColor?: string;
  color?: string;
  includelogo?: boolean;
  logoSize?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
};

export class QRCodeService {
  private static instance: QRCodeService;

  static getInstance(): QRCodeService {
    if (!QRCodeService.instance) {
      QRCodeService.instance = new QRCodeService();
    }
    return QRCodeService.instance;
  }

  // Generate QR code data from traceability event
  generateQRCodeData(event: TraceabilityEvent, additionalData?: Partial<QRCodeData>): QRCodeData {
    const baseData: QRCodeData = {
      lotId: this.generateLotId(event),
      farmerId: event.actorId,
      harvestDate: event.occurredAt,
      traceUrl: `https://jani-trace.com/lot/${this.generateLotId(event)}`,
    };

    // Extract specific data based on event type
    if (event.type === 'harvest_collection' && 'harvestLotId' in event.payload) {
      baseData.lotId = event.payload.harvestLotId as string;
      baseData.quantity = event.payload.quantity as number;
      baseData.unit = event.payload.unit as string;
      baseData.quality = event.payload.quality as string;
    }

    if (event.type === 'plot_registration' && 'cropType' in event.payload) {
      baseData.cropType = event.payload.cropType as string;
    }

    if (event.location) {
      baseData.plotId = `PLOT-${event.location.latitude.toFixed(4)}-${event.location.longitude.toFixed(4)}`;
    }

    // Add any additional data
    return { ...baseData, ...additionalData };
  }

  // Generate a unique lot ID from event data
  private generateLotId(event: TraceabilityEvent): string {
    const date = new Date(event.occurredAt);
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const farmerId = event.actorId.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const eventId = event.id.slice(-4).toUpperCase();
    
    return `${farmerId}-${dateStr}-${eventId}`;
  }

  // Create QR code string from data
  createQRCodeString(data: QRCodeData): string {
    // Create a structured string that can be parsed by scanners
    const qrString = JSON.stringify({
      v: '1.0', // Version
      id: data.lotId,
      f: data.farmerId,
      p: data.plotId,
      h: data.harvestDate,
      c: data.cropType,
      q: data.quality,
      qt: data.quantity,
      u: data.unit,
      e: data.expiryDate,
      cert: data.certifications,
      url: data.traceUrl,
    });

    return qrString;
  }

  // Generate QR code image and save it
  async generateQRCodeImage(
    eventId: string,
    qrData: QRCodeData,
    options: QRCodeGenerationOptions = {}
  ): Promise<MediaFile | null> {
    try {
      const qrString = this.createQRCodeString(qrData);
      const fileName = `qr_${qrData.lotId}_${nanoid()}.svg`;
      const tempUri = `${FileSystem.documentDirectory}qrcodes/${fileName}`;

      // Create directory if it doesn't exist
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}qrcodes/`, {
        intermediates: true,
      });

      // Create SVG QR code content
      const svgContent = this.generateSVGQRCode(qrString, options);
      
      // Write SVG file
      await FileSystem.writeAsStringAsync(tempUri, svgContent);

      const fileInfo = await FileSystem.getInfoAsync(tempUri);
      if (!fileInfo.exists) {
        throw new Error('Failed to generate QR code');
      }

      // Calculate checksum
      const checksum = await this.calculateChecksum(tempUri);

      const mediaFile: MediaFile = {
        id: nanoid(),
        eventId,
        type: 'qr_code',
        uri: tempUri,
        checksum,
  size: resolveFileSize(fileInfo),
        mimeType: 'image/svg+xml',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      return mediaFile;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  }

  // Generate SVG QR code content (simplified implementation)
  private generateSVGQRCode(data: string, options: QRCodeGenerationOptions): string {
    const size = options.size || 200;
    const backgroundColor = options.backgroundColor || '#ffffff';
    const color = options.color || '#000000';

    // This is a simplified SVG - in a real implementation you'd use a proper QR code library
    const svgContent = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="${backgroundColor}"/>
        <text x="${size/2}" y="${size/2}" text-anchor="middle" dominant-baseline="central" 
              font-family="monospace" font-size="8" fill="${color}">
          QR: ${data.substring(0, 20)}...
        </text>
      </svg>
    `.trim();

    return svgContent;
  }

  // Calculate simple checksum for QR code file
  private async calculateChecksum(uri: string): Promise<string> {
    try {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  const timestamp = Date.now();
  const size = resolveFileSize(fileInfo);

  return `qr_${size}_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    } catch (error) {
      console.error('Error calculating QR checksum:', error);
      return `qr_checksum_error_${Date.now()}`;
    }
  }

  // Parse QR code data from scanned string
  parseQRCodeData(qrString: string): QRCodeData | null {
    try {
      const parsed = JSON.parse(qrString);
      
      if (!parsed.v || parsed.v !== '1.0') {
        // Try to parse as legacy format or simple string
        return this.parseLegacyQRCode(qrString);
      }

      return {
        lotId: parsed.id,
        farmerId: parsed.f,
        plotId: parsed.p,
        harvestDate: parsed.h,
        cropType: parsed.c,
        quality: parsed.q,
        quantity: parsed.qt,
        unit: parsed.u,
        expiryDate: parsed.e,
        certifications: parsed.cert,
        traceUrl: parsed.url,
      };
    } catch (error) {
      console.error('Error parsing QR code data:', error);
      return this.parseLegacyQRCode(qrString);
    }
  }

  // Parse legacy or simple QR code formats
  private parseLegacyQRCode(qrString: string): QRCodeData | null {
    try {
      // Try to extract lot ID from simple formats like "LOT-123" or "FARM-001-LOT-456"
      const lotIdMatch = qrString.match(/(?:LOT-|-)([A-Z0-9-]+)/i);
      const farmerIdMatch = qrString.match(/FARM-([A-Z0-9]+)/i);

      if (lotIdMatch) {
        return {
          lotId: lotIdMatch[1],
          farmerId: farmerIdMatch ? farmerIdMatch[1] : 'UNKNOWN',
          harvestDate: new Date().toISOString(),
          traceUrl: `https://jani-trace.com/lot/${lotIdMatch[1]}`,
        };
      }

      // If no pattern matches, treat the entire string as a lot ID
      return {
        lotId: qrString,
        farmerId: 'UNKNOWN',
        harvestDate: new Date().toISOString(),
        traceUrl: `https://jani-trace.com/lot/${qrString}`,
      };
    } catch (error) {
      console.error('Error parsing legacy QR code:', error);
      return null;
    }
  }

  // Generate batch QR codes for multiple lots
  async generateBatchQRCodes(
    events: TraceabilityEvent[],
    options: QRCodeGenerationOptions = {}
  ): Promise<MediaFile[]> {
    const qrCodes: MediaFile[] = [];

    for (const event of events) {
      const qrData = this.generateQRCodeData(event);
      const qrCode = await this.generateQRCodeImage(event.id, qrData, options);
      
      if (qrCode) {
        qrCodes.push(qrCode);
      }
    }

    return qrCodes;
  }

  // Validate QR code data completeness
  validateQRCodeData(data: QRCodeData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.lotId) {
      errors.push('Lot ID is required');
    }

    if (!data.farmerId) {
      errors.push('Farmer ID is required');
    }

    if (!data.harvestDate) {
      errors.push('Harvest date is required');
    }

    if (data.quantity && !data.unit) {
      errors.push('Unit is required when quantity is specified');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Get QR code statistics
  async getQRCodeStats(): Promise<{
    totalQRCodes: number;
    totalSize: number;
    oldestQRCode?: string;
    newestQRCode?: string;
  }> {
    try {
      const qrCodesDir = `${FileSystem.documentDirectory}qrcodes/`;
      let totalQRCodes = 0;
      let totalSize = 0;
      let oldestTime = Infinity;
      let newestTime = 0;
      let oldestQRCode = '';
      let newestQRCode = '';

      try {
        const qrCodes = await FileSystem.readDirectoryAsync(qrCodesDir);

        for (const qrCode of qrCodes) {
          const qrPath = `${qrCodesDir}${qrCode}`;
          const fileInfo = await FileSystem.getInfoAsync(qrPath);

          if (fileInfo.exists) {
            totalQRCodes++;
            totalSize += resolveFileSize(fileInfo);

            if (fileInfo.modificationTime) {
              if (fileInfo.modificationTime < oldestTime) {
                oldestTime = fileInfo.modificationTime;
                oldestQRCode = qrCode;
              }
              if (fileInfo.modificationTime > newestTime) {
                newestTime = fileInfo.modificationTime;
                newestQRCode = qrCode;
              }
            }
          }
        }
      } catch {
        // QR codes directory might not exist
      }

      return {
        totalQRCodes,
        totalSize,
        oldestQRCode: oldestQRCode || undefined,
        newestQRCode: newestQRCode || undefined,
      };
    } catch (error) {
      console.error('Error getting QR code stats:', error);
      return {
        totalQRCodes: 0,
        totalSize: 0,
      };
    }
  }

  // Clean up old QR codes
  async cleanupOldQRCodes(olderThanDays = 90): Promise<void> {
    try {
      const qrCodesDir = `${FileSystem.documentDirectory}qrcodes/`;
      const cutoffDate = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);

      try {
        const qrCodes = await FileSystem.readDirectoryAsync(qrCodesDir);

        for (const qrCode of qrCodes) {
          const qrPath = `${qrCodesDir}${qrCode}`;
          const fileInfo = await FileSystem.getInfoAsync(qrPath);

          if (fileInfo.exists && fileInfo.modificationTime && fileInfo.modificationTime < cutoffDate) {
            await FileSystem.deleteAsync(qrPath);
          }
        }
      } catch {
        // QR codes directory might not exist
      }
    } catch (error) {
      console.error('Error cleaning up old QR codes:', error);
    }
  }
}

// Singleton instance
export const qrCodeService = QRCodeService.getInstance();

// Hook for React components
export function useQRCode() {
  const generateQRCode = async (
    event: TraceabilityEvent,
    additionalData?: Partial<QRCodeData>,
    options?: QRCodeGenerationOptions
  ): Promise<MediaFile | null> => {
    const qrData = qrCodeService.generateQRCodeData(event, additionalData);
    return qrCodeService.generateQRCodeImage(event.id, qrData, options);
  };

  const parseQRCode = (qrString: string): QRCodeData | null => {
    return qrCodeService.parseQRCodeData(qrString);
  };

  const validateQRData = (data: QRCodeData) => {
    return qrCodeService.validateQRCodeData(data);
  };

  const generateBatch = async (
    events: TraceabilityEvent[],
    options?: QRCodeGenerationOptions
  ): Promise<MediaFile[]> => {
    return qrCodeService.generateBatchQRCodes(events, options);
  };

  return {
    generateQRCode,
    parseQRCode,
    validateQRData,
    generateBatch,
    getStats: qrCodeService.getQRCodeStats.bind(qrCodeService),
    cleanup: qrCodeService.cleanupOldQRCodes.bind(qrCodeService),
  };
}