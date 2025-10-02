import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '../types'
import { AuthService } from '../services/authService'
import { requestNotificationPermission } from '../services/firebase'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: () => Promise<boolean>
  signOut: () => Promise<boolean>
  updateProfile: (updates: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      setUser(user)
      setIsLoading(false)
      
      // Request notification permission when user signs in
      if (user) {
        requestNotificationPermission().then(token => {
          if (token) {
            AuthService.updateFCMToken(token)
          }
        })
      }
    })

    return unsubscribe
  }, [])

  const signIn = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const user = await AuthService.signInAnonymously()
      if (user) {
        setUser(user)
        return true
      }
      return false
    } catch (error) {
      console.error('Sign in failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const success = await AuthService.signOut()
      if (success) {
        setUser(null)
      }
      return success
    } catch (error) {
      console.error('Sign out failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      const success = await AuthService.updateUserProfile(updates)
      if (success && user) {
        setUser({ ...user, ...updates })
      }
      return success
    } catch (error) {
      console.error('Profile update failed:', error)
      return false
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}