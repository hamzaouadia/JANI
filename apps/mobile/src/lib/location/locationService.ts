import * as Location from 'expo-location';
import { Alert } from 'react-native';
import type { LocationData } from '@/constants/traceabilityEvents';

export class LocationService {
  private static instance: LocationService;
  private currentLocation: Location.LocationObject | null = null;
  private watchSubscription: Location.LocationSubscription | null = null;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'This app needs location permissions to record GPS coordinates for traceability events. Please enable location access in your device settings.',
          [{ text: 'OK' }]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      });

      this.currentLocation = location;

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
        altitude: location.coords.altitude || undefined,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Location Error', 'Unable to get current location. Please try again.');
      return null;
    }
  }

  async startLocationTracking(onLocationUpdate: (_location: LocationData) => void): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      this.watchSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          this.currentLocation = location;
          onLocationUpdate({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || undefined,
            altitude: location.coords.altitude || undefined,
            timestamp: location.timestamp,
          });
        }
      );

      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      return false;
    }
  }

  stopLocationTracking(): void {
    if (this.watchSubscription) {
      this.watchSubscription.remove();
      this.watchSubscription = null;
    }
  }

  getLastKnownLocation(): LocationData | null {
    if (!this.currentLocation) {
      return null;
    }

    return {
      latitude: this.currentLocation.coords.latitude,
      longitude: this.currentLocation.coords.longitude,
      accuracy: this.currentLocation.coords.accuracy || undefined,
      altitude: this.currentLocation.coords.altitude || undefined,
      timestamp: this.currentLocation.timestamp,
    };
  }

  // Helper to format location for display
  formatLocationForDisplay(location: LocationData): string {
    const lat = location.latitude.toFixed(6);
    const lng = location.longitude.toFixed(6);
    const accuracy = location.accuracy ? ` (±${location.accuracy.toFixed(0)}m)` : '';
    return `${lat}, ${lng}${accuracy}`;
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(loc1: LocationData, loc2: LocationData): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (loc1.latitude * Math.PI) / 180;
    const φ2 = (loc2.latitude * Math.PI) / 180;
    const Δφ = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const Δλ = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Validate location accuracy for traceability requirements
  isLocationAccurate(location: LocationData, requiredAccuracy = 10): boolean {
    return !location.accuracy || location.accuracy <= requiredAccuracy;
  }

  // Check if location is within a geofence (simple circular geofence)
  isWithinGeofence(
    currentLocation: LocationData,
    centerLocation: LocationData,
    radiusMeters: number
  ): boolean {
    const distance = this.calculateDistance(currentLocation, centerLocation);
    return distance <= radiusMeters;
  }

  // Generate a human-readable address from coordinates (requires geocoding service)
  async reverseGeocode(location: LocationData): Promise<string | null> {
    try {
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.latitude,
        longitude: location.longitude,
      });

      if (address) {
        const parts = [];
        if (address.street) parts.push(address.street);
        if (address.city) parts.push(address.city);
        if (address.region) parts.push(address.region);
        if (address.country) parts.push(address.country);
        return parts.join(', ');
      }

      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  // Validate GPS coordinates
  isValidLocation(location: LocationData): boolean {
    return (
      location.latitude >= -90 &&
      location.latitude <= 90 &&
      location.longitude >= -180 &&
      location.longitude <= 180
    );
  }

  // Create a location object from coordinates
  createLocationData(
    latitude: number,
    longitude: number,
    accuracy?: number,
    altitude?: number
  ): LocationData {
    return {
      latitude,
      longitude,
      accuracy,
      altitude,
      timestamp: Date.now(),
    };
  }
}

// Singleton instance
export const locationService = LocationService.getInstance();

// Hook for React components
export function useLocation() {
  const getCurrentLocation = async (): Promise<LocationData | null> => {
    return locationService.getCurrentLocation();
  };

  const formatLocation = (location: LocationData): string => {
    return locationService.formatLocationForDisplay(location);
  };

  const isAccurate = (location: LocationData, requiredAccuracy = 10): boolean => {
    return locationService.isLocationAccurate(location, requiredAccuracy);
  };

  return {
    getCurrentLocation,
    formatLocation,
    isAccurate,
    calculateDistance: locationService.calculateDistance.bind(locationService),
    reverseGeocode: locationService.reverseGeocode.bind(locationService),
  };
}