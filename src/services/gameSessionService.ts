// Game Session Service - handles activity tracking
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'
import { GameSession, LocationPoint } from '../types'

export class GameSessionService {
  private static readonly COLLECTION_NAME = 'gameSessions'
  private static currentSession: GameSession | null = null
  
  // Start new game session
  static async startSession(
    userId: string, 
    sessionType: 'WALK' | 'RUN' | 'BIKE' | 'GENERAL',
    startLocation: LocationPoint
  ): Promise<boolean> {
    try {
      const sessionData = {
        userId,
        sessionType,
        startTime: serverTimestamp(),
        isActive: true,
        startLocation: {
          latitude: startLocation.latitude,
          longitude: startLocation.longitude,
          altitude: startLocation.altitude,
          accuracy: startLocation.accuracy,
          timestamp: startLocation.timestamp,
          speed: startLocation.speed,
          bearing: startLocation.bearing
        },
        locationHistory: [startLocation],
        totalDistance: 0,
        totalDuration: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        caloriesBurned: 0,
        stepCount: 0,
        territoriesCaptured: [],
        knowledgeOrbsCollected: [],
        pointsEarned: 0,
        achievements: []
      }
      
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), sessionData)
      
      this.currentSession = {
        id: docRef.id,
        ...sessionData,
        startTime: new Date(),
        endTime: undefined
      } as GameSession
      
      return true
    } catch (error) {
      console.error('Error starting session:', error)
      return false
    }
  }
  
  // Update session with new location
  static async updateSessionLocation(locationPoint: LocationPoint): Promise<boolean> {
    if (!this.currentSession) return false
    
    try {
      const sessionRef = doc(db, this.COLLECTION_NAME, this.currentSession.id)
      
      // Calculate distance from last location
      const lastLocation = this.currentSession.locationHistory[this.currentSession.locationHistory.length - 1]
      const distance = this.calculateDistance(lastLocation, locationPoint)
      
      // Update session data
      this.currentSession.locationHistory.push(locationPoint)
      this.currentSession.totalDistance += distance
      this.currentSession.totalDuration = Date.now() - this.currentSession.startTime.getTime()
      
      if (locationPoint.speed && locationPoint.speed > this.currentSession.maxSpeed) {
        this.currentSession.maxSpeed = locationPoint.speed
      }
      
      this.currentSession.averageSpeed = this.currentSession.totalDistance / (this.currentSession.totalDuration / 1000)
      this.currentSession.caloriesBurned = this.calculateCalories(this.currentSession.totalDistance, this.currentSession.sessionType)
      this.currentSession.stepCount = this.estimateSteps(this.currentSession.totalDistance)
      
      // Update Firestore
      await updateDoc(sessionRef, {
        locationHistory: this.currentSession.locationHistory,
        totalDistance: this.currentSession.totalDistance,
        totalDuration: this.currentSession.totalDuration,
        averageSpeed: this.currentSession.averageSpeed,
        maxSpeed: this.currentSession.maxSpeed,
        caloriesBurned: this.currentSession.caloriesBurned,
        stepCount: this.currentSession.stepCount
      })
      
      return true
    } catch (error) {
      console.error('Error updating session location:', error)
      return false
    }
  }
  
  // End current session
  static async endCurrentSession(): Promise<GameSession | null> {
    if (!this.currentSession) return null
    
    try {
      const sessionRef = doc(db, this.COLLECTION_NAME, this.currentSession.id)
      const endTime = new Date()
      
      await updateDoc(sessionRef, {
        endTime: serverTimestamp(),
        isActive: false,
        endLocation: this.currentSession.locationHistory[this.currentSession.locationHistory.length - 1]
      })
      
      const completedSession = { 
        ...this.currentSession, 
        endTime,
        isActive: false 
      }
      
      this.currentSession = null
      return completedSession
    } catch (error) {
      console.error('Error ending session:', error)
      return null
    }
  }
  
  // Get user session history
  static async getUserSessions(userId: string, limitCount: number = 10): Promise<GameSession[]> {
    try {
      const sessionsQuery = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('isActive', '==', false),
        orderBy('startTime', 'desc'),
        limit(limitCount)
      )
      
      const snapshot = await getDocs(sessionsQuery)
      const sessions: GameSession[] = []
      
      snapshot.forEach((doc: any) => {
        const data = doc.data()
        sessions.push({
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate() || new Date(),
          endTime: data.endTime?.toDate()
        } as GameSession)
      })
      
      return sessions
    } catch (error) {
      console.error('Error fetching user sessions:', error)
      return []
    }
  }
  
  // Get current active session
  static getCurrentSession(): GameSession | null {
    return this.currentSession
  }
  
  // Calculate distance between two points using Haversine formula
  private static calculateDistance(point1: LocationPoint, point2: LocationPoint): number {
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
    
    return R * c
  }
  
  // Estimate calories burned based on distance and activity type
  private static calculateCalories(distanceMeters: number, sessionType: string): number {
    const distanceKm = distanceMeters / 1000
    const baseCaloriesPerKm = {
      'WALK': 50,
      'RUN': 80,
      'BIKE': 40,
      'GENERAL': 60
    }
    
    return Math.round(distanceKm * (baseCaloriesPerKm[sessionType as keyof typeof baseCaloriesPerKm] || 60))
  }
  
  // Estimate steps based on distance (average stride length)
  private static estimateSteps(distanceMeters: number): number {
    const averageStrideLength = 0.75 // meters
    return Math.round(distanceMeters / averageStrideLength)
  }
}