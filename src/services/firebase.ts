// Firebase configuration - matches Android app setup
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { getAnalytics } from 'firebase/analytics'

// Firebase config - replace with your actual config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const analytics = getAnalytics(app)

// Initialize messaging for push notifications
let messaging: any = null
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app)
  } catch (error) {
    console.warn('Firebase messaging not available:', error)
  }
}

// Development emulators (uncomment for local development)
// if (process.env.NODE_ENV === 'development') {
//   connectAuthEmulator(auth, 'http://localhost:9099')
//   connectFirestoreEmulator(db, 'localhost', 8080)
// }

// FCM token and message handling
export const requestNotificationPermission = async () => {
  if (!messaging) return null
  
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'your-vapid-key' // Replace with your VAPID key
      })
      return token
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error)
  }
  return null
}

export const onMessageListener = () => {
  if (!messaging) return Promise.resolve()
  
  return new Promise((resolve) => {
    onMessage(messaging, (payload: any) => {
      resolve(payload)
    })
  })
}

export { messaging }
export default app