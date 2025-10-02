// Authentication service - matches Android app functionality
import { 
  signInAnonymously, 
  onAuthStateChanged, 
  User as FirebaseUser,
  updateProfile 
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import { User } from '../types'

export class AuthService {
  // Anonymous sign-in (matches Android app)
  static async signInAnonymously(): Promise<User | null> {
    try {
      const userCredential = await signInAnonymously(auth)
      const firebaseUser = userCredential.user
      
      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        email: firebaseUser.email || undefined,
        displayName: firebaseUser.displayName || `Explorer ${firebaseUser.uid.slice(-6)}`,
        profilePictureUrl: firebaseUser.photoURL || undefined,
        createdAt: new Date(),
        lastActiveAt: new Date(),
        totalPoints: 0,
        currentStreak: 0,
        maxStreak: 0,
        level: 1,
        achievements: [],
        preferences: {
          notificationsEnabled: true,
          locationSharingEnabled: true,
          activityTrackingEnabled: true,
          soundEnabled: true,
          vibrationEnabled: true,
          theme: 'system'
        },
        statistics: {
          totalDistanceWalked: 0,
          totalTimeActive: 0,
          territoriesCaptured: 0,
          knowledgeOrbsCollected: 0,
          streakDays: 0,
          pointsEarned: 0,
          levelsUnlocked: 1
        }
      }
      
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp()
      })
      
      return { ...userData, id: firebaseUser.uid }
    } catch (error) {
      console.error('Anonymous sign-in failed:', error)
      return null
    }
  }
  
  // Get current user data
  static async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) return null
    
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          id: firebaseUser.uid,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastActiveAt: data.lastActiveAt?.toDate() || new Date()
        } as User
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
    
    return null
  }
  
  // Update user profile
  static async updateUserProfile(updates: Partial<User>): Promise<boolean> {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) return false
    
    try {
      // Update Firebase Auth profile
      if (updates.displayName) {
        await updateProfile(firebaseUser, {
          displayName: updates.displayName,
          photoURL: updates.profilePictureUrl
        })
      }
      
      // Update Firestore document
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        ...updates,
        lastActiveAt: serverTimestamp()
      })
      
      return true
    } catch (error) {
      console.error('Error updating user profile:', error)
      return false
    }
  }
  
  // Update FCM token
  static async updateFCMToken(token: string): Promise<boolean> {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) return false
    
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        fcmToken: token,
        lastActiveAt: serverTimestamp()
      })
      return true
    } catch (error) {
      console.error('Error updating FCM token:', error)
      return false
    }
  }
  
  // Sign out
  static async signOut(): Promise<boolean> {
    try {
      await auth.signOut()
      return true
    } catch (error) {
      console.error('Error signing out:', error)
      return false
    }
  }
  
  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}