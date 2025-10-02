import React, { createContext, useContext, useEffect, useState } from 'react'
import { LocationPoint } from '../types'
import { LocationService } from '../services/locationService'

interface LocationContextType {
  currentLocation: LocationPoint | null
  isLocationEnabled: boolean
  isTracking: boolean
  requestPermission: () => Promise<boolean>
  startTracking: () => Promise<boolean>
  stopTracking: () => void
  getCurrentLocation: () => Promise<LocationPoint | null>
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

interface LocationProviderProps {
  children: React.ReactNode
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null)
  const [isLocationEnabled, setIsLocationEnabled] = useState(false)
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    // Check if geolocation is supported
    if (navigator.geolocation) {
      setIsLocationEnabled(true)
    }
    
    // Clean up tracking on unmount
    return () => {
      if (isTracking) {
        LocationService.stopLocationTracking()
      }
    }
  }, [isTracking])

  const requestPermission = async (): Promise<boolean> => {
    const granted = await LocationService.requestLocationPermission()
    setIsLocationEnabled(granted)
    
    if (granted) {
      // Get initial location
      const location = await LocationService.getCurrentLocation()
      if (location) {
        setCurrentLocation(location)
      }
    }
    
    return granted
  }

  const startTracking = async (): Promise<boolean> => {
    if (!isLocationEnabled) {
      const permissionGranted = await requestPermission()
      if (!permissionGranted) return false
    }

    const success = LocationService.startLocationTracking(
      (location) => {
        setCurrentLocation(location)
      },
      (error) => {
        console.error('Location tracking error:', error)
        setIsTracking(false)
      }
    )

    setIsTracking(success)
    return success
  }

  const stopTracking = (): void => {
    LocationService.stopLocationTracking()
    setIsTracking(false)
  }

  const getCurrentLocation = async (): Promise<LocationPoint | null> => {
    const location = await LocationService.getCurrentLocation()
    if (location) {
      setCurrentLocation(location)
    }
    return location
  }

  const value: LocationContextType = {
    currentLocation,
    isLocationEnabled,
    isTracking,
    requestPermission,
    startTracking,
    stopTracking,
    getCurrentLocation
  }

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}