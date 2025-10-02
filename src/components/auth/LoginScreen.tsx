import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import './LoginScreen.css'

const LoginScreen = () => {
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleAnonymousSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn()
    } catch (error) {
      console.error('Sign in failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-content">
        <div className="brand">
          <div className="logo-container">
            <div className="logo-icon">🌟</div>
            <h1>YouMatter</h1>
            <p className="tagline">Wellness Realms</p>
          </div>
        </div>
        
        <div className="welcome-content">
          <h2>Welcome to Your Wellness Journey</h2>
          <p>Discover territories, collect knowledge orbs, and build healthy habits while exploring the world around you.</p>
          
          <div className="features">
            <div className="feature">
              <span className="feature-icon">🗺️</span>
              <span>Explore Interactive Maps</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🏆</span>
              <span>Capture Territories</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💡</span>
              <span>Collect Knowledge Orbs</span>
            </div>
            <div className="feature">
              <span className="feature-icon">👥</span>
              <span>Connect with Community</span>
            </div>
          </div>
        </div>
        
        <div className="auth-actions">
          <button 
            className="sign-in-btn primary"
            onClick={handleAnonymousSignIn}
            disabled={isLoading}
          >
            {isLoading ? 'Starting Journey...' : 'Start Your Journey'}
          </button>
          
          <p className="privacy-note">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            Your wellness journey is completely anonymous and private.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen