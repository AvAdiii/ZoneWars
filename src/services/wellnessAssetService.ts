// Wellness Asset Service - handles territories and knowledge orbs
import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { WellnessAsset } from '../types'
import { LocationService } from './locationService'

export class WellnessAssetService {
  private static readonly COLLECTION_NAME = 'wellnessAssets'
  
  // Get nearby assets within radius
  static async getNearbyAssets(
    latitude: number, 
    longitude: number, 
    radiusMeters: number = 1000
  ): Promise<WellnessAsset[]> {
    try {
      // Firestore doesn't support radius queries directly, so we use bounding box
      const latDelta = radiusMeters / 111000 // Rough conversion to degrees
      
      const assetsQuery = query(
        collection(db, this.COLLECTION_NAME),
        where('latitude', '>=', latitude - latDelta),
        where('latitude', '<=', latitude + latDelta),
        where('isActive', '==', true),
        orderBy('latitude'),
        limit(50)
      )
      
      const snapshot = await getDocs(assetsQuery)
      const assets: WellnessAsset[] = []
      
      snapshot.forEach((doc: any) => {
        const data = doc.data()
        const asset: WellnessAsset = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastUpdatedAt: data.lastUpdatedAt?.toDate() || new Date(),
          capturedAt: data.capturedAt?.toDate(),
          contestStartTime: data.contestStartTime?.toDate(),
          contestEndTime: data.contestEndTime?.toDate()
        } as WellnessAsset
        
        // Check if asset is within actual radius
        const distance = LocationService.calculateDistance(
          { latitude, longitude },
          { latitude: asset.latitude, longitude: asset.longitude }
        )
        
        if (distance <= radiusMeters) {
          assets.push(asset)
        }
      })
      
      return assets
    } catch (error) {
      console.error('Error fetching nearby assets:', error)
      return []
    }
  }
  
  // Capture territory
  static async captureTerritory(territoryId: string, userId: string): Promise<boolean> {
    try {
      const territoryRef = doc(db, this.COLLECTION_NAME, territoryId)
      
      await updateDoc(territoryRef, {
        ownerId: userId,
        capturedAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
        isContested: false,
        contestParticipants: []
      })
      
      return true
    } catch (error) {
      console.error('Error capturing territory:', error)
      return false
    }
  }
  
  // Start territory contest
  static async contestTerritory(territoryId: string, userId: string): Promise<boolean> {
    try {
      const territoryRef = doc(db, this.COLLECTION_NAME, territoryId)
      
      await updateDoc(territoryRef, {
        isContested: true,
        contestStartTime: serverTimestamp(),
        contestEndTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        contestParticipants: [userId],
        lastUpdatedAt: serverTimestamp()
      })
      
      return true
    } catch (error) {
      console.error('Error contesting territory:', error)
      return false
    }
  }
  
  // Collect knowledge orb
  static async collectKnowledgeOrb(orbId: string, userId: string): Promise<boolean> {
    try {
      const orbRef = doc(db, this.COLLECTION_NAME, orbId)
      
      await updateDoc(orbRef, {
        collectedBy: [userId], // In real app, this would be arrayUnion
        lastUpdatedAt: serverTimestamp()
      })
      
      return true
    } catch (error) {
      console.error('Error collecting knowledge orb:', error)
      return false
    }
  }
  
  // Create new territory (admin function)
  static async createTerritory(
    latitude: number,
    longitude: number,
    title: string,
    description: string,
    radius: number = 50,
    points: number = 100
  ): Promise<string | null> {
    try {
      const territoryData = {
        type: 'TERRITORY',
        latitude,
        longitude,
        radius,
        title,
        description,
        points,
        createdAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
        isActive: true,
        isContested: false,
        contestParticipants: []
      }
      
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), territoryData)
      return docRef.id
    } catch (error) {
      console.error('Error creating territory:', error)
      return null
    }
  }
  
  // Create new knowledge orb (admin function)
  static async createKnowledgeOrb(
    latitude: number,
    longitude: number,
    title: string,
    question: string,
    options: string[],
    correctAnswer: number,
    difficulty: 'EASY' | 'MEDIUM' | 'HARD',
    category: string,
    points: number = 50
  ): Promise<string | null> {
    try {
      const orbData = {
        type: 'KNOWLEDGE_ORB',
        latitude,
        longitude,
        radius: 30,
        title,
        description: `${difficulty} ${category} question`,
        question,
        options,
        correctAnswer,
        difficulty,
        category,
        points,
        createdAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
        isActive: true,
        collectedBy: []
      }
      
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), orbData)
      return docRef.id
    } catch (error) {
      console.error('Error creating knowledge orb:', error)
      return null
    }
  }
}