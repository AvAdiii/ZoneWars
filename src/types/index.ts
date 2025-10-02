// Core data models - Direct translation from Android Kotlin classes

export interface User {
  id: string
  email?: string
  displayName: string
  profilePictureUrl?: string
  createdAt: Date
  lastActiveAt: Date
  totalPoints: number
  currentStreak: number
  maxStreak: number
  level: number
  achievements: string[]
  fcmToken?: string
  preferences: UserPreferences
  statistics: UserStatistics
}

export interface UserPreferences {
  notificationsEnabled: boolean
  locationSharingEnabled: boolean
  activityTrackingEnabled: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
  theme: 'light' | 'dark' | 'system'
}

export interface UserStatistics {
  totalDistanceWalked: number
  totalTimeActive: number
  territoriesCaptured: number
  knowledgeOrbsCollected: number
  streakDays: number
  pointsEarned: number
  levelsUnlocked: number
}

export interface WellnessAsset {
  id: string
  type: 'TERRITORY' | 'KNOWLEDGE_ORB'
  latitude: number
  longitude: number
  radius: number
  title: string
  description: string
  points: number
  createdAt: Date
  lastUpdatedAt: Date
  isActive: boolean
  
  // Territory specific
  ownerId?: string
  ownerDisplayName?: string
  capturedAt?: Date
  isContested: boolean
  contestStartTime?: Date
  contestEndTime?: Date
  contestParticipants: string[]
  
  // Knowledge Orb specific
  question?: string
  options?: string[]
  correctAnswer?: number
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  category: string
  collectedBy: string[]
}

export interface KnowledgeOrb {
  id: string
  title: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  category: string
  points: number
  latitude: number
  longitude: number
  radius: number
  isActive: boolean
  createdAt: Date
  expiresAt?: Date
  collectedBy: string[]
  maxCollections?: number
}

export interface Post {
  id: string
  authorId: string
  authorDisplayName: string
  authorProfilePicture?: string
  content: string
  type: 'ACHIEVEMENT' | 'PROGRESS' | 'GENERAL' | 'MILESTONE'
  imageUrl?: string
  createdAt: Date
  lastUpdatedAt: Date
  likes: string[]
  comments: Comment[]
  isPublic: boolean
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  tags: string[]
  achievements?: string[]
}

export interface Comment {
  id: string
  authorId: string
  authorDisplayName: string
  authorProfilePicture?: string
  content: string
  createdAt: Date
  likes: string[]
  parentCommentId?: string
}

export interface GameSession {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  isActive: boolean
  sessionType: 'WALK' | 'RUN' | 'BIKE' | 'GENERAL'
  
  // Location tracking
  startLocation: LocationPoint
  endLocation?: LocationPoint
  locationHistory: LocationPoint[]
  
  // Session statistics
  totalDistance: number
  totalDuration: number
  averageSpeed: number
  maxSpeed: number
  caloriesBurned: number
  stepCount: number
  
  // Game achievements during session
  territoriesCaptured: string[]
  knowledgeOrbsCollected: string[]
  pointsEarned: number
  achievements: string[]
}

export interface LocationPoint {
  latitude: number
  longitude: number
  altitude?: number
  accuracy: number
  timestamp: Date
  speed?: number
  bearing?: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  iconUrl: string
  category: 'DISTANCE' | 'TERRITORY' | 'KNOWLEDGE' | 'STREAK' | 'SOCIAL' | 'SPECIAL'
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
  points: number
  requirements: AchievementRequirement
  unlockedAt?: Date
  isUnlocked: boolean
  progress: number
  maxProgress: number
}

export interface AchievementRequirement {
  type: 'DISTANCE' | 'TERRITORIES' | 'KNOWLEDGE_ORBS' | 'STREAK' | 'POSTS' | 'LIKES'
  target: number
  timeframe?: 'DAY' | 'WEEK' | 'MONTH' | 'ALL_TIME'
}

export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  type: 'CONTEST' | 'ACHIEVEMENT' | 'ORBS' | 'SOCIAL' | 'SYSTEM'
  data?: Record<string, any>
  isRead: boolean
  createdAt: Date
  expiresAt?: Date
  actionUrl?: string
}

// UI State types
export interface MapState {
  center: { lat: number; lng: number }
  zoom: number
  userLocation?: LocationPoint
  isLocationEnabled: boolean
  isTracking: boolean
  nearbyAssets: WellnessAsset[]
  selectedAsset?: WellnessAsset
  mapType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain'
}

export interface AppState {
  user?: User
  isAuthenticated: boolean
  isLoading: boolean
  activeSession?: GameSession
  notifications: Notification[]
  achievements: Achievement[]
  userStats: UserStatistics
}