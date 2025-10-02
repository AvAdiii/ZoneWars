// Location service - matches Android app functionality
import { LocationPoint } from '../types'

export class LocationService {
  private static watchId: number | null = null
  private static isTracking = false
  
  // Request location permission
  static async requestLocationPermission(): Promise<boolean> {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser')
      return false
    }
    
    try {
      // Try to get current position to trigger permission request
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })
      return true
    } catch (error) {
      console.error('Location permission denied:', error)
      return false
    }
  }
  
  // Get current location
  static async getCurrentLocation(): Promise<LocationPoint | null> {
    if (!navigator.geolocation) return null
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000 // 30 seconds
        })
      })
      
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude || undefined,
        accuracy: position.coords.accuracy,
        timestamp: new Date(),
        speed: position.coords.speed || undefined,
        bearing: position.coords.heading || undefined
      }
    } catch (error) {
      console.error('Error getting current location:', error)
      return null
    }
  }
  
  // Start location tracking
  static startLocationTracking(
    onLocationUpdate: (location: LocationPoint) => void,
    onError?: (error: GeolocationPositionError) => void
  ): boolean {
    if (!navigator.geolocation || this.isTracking) return false
    
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: LocationPoint = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude || undefined,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
          speed: position.coords.speed || undefined,
          bearing: position.coords.heading || undefined
        }
        onLocationUpdate(location)
      },
      (error) => {
        console.error('Location tracking error:', error)
        if (onError) onError(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000 // 1 second
      }
    )
    
    this.isTracking = true
    return true
  }
  
  // Stop location tracking
  static stopLocationTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
    this.isTracking = false
  }
  
  // Calculate distance between two points (Haversine formula)
  static calculateDistance(
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
  ): number {
    const R = 6371000 // Earth's radius in meters
    const lat1Rad = (point1.latitude * Math.PI) / 180
    const lat2Rad = (point2.latitude * Math.PI) / 180
    const deltaLat = ((point2.latitude - point1.latitude) * Math.PI) / 180
    const deltaLng = ((point2.longitude - point1.longitude) * Math.PI) / 180
    
    const a = 
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) *
      Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    
    return R * c // Distance in meters
  }
  
  // Check if point is within radius of target
  static isWithinRadius(
    userLocation: { latitude: number; longitude: number },
    targetLocation: { latitude: number; longitude: number },
    radius: number
  ): boolean {
    const distance = this.calculateDistance(userLocation, targetLocation)
    return distance <= radius
  }
  
  // Get tracking status
  static getTrackingStatus(): boolean {
    return this.isTracking
  }
}