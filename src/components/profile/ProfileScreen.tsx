// Profile Screen - matches Android app functionality
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { User, Achievement, GameSession } from '../../types'
import { GameSessionService } from '../../services/gameSessionService'
import './ProfileScreen.css'

const ProfileScreen = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [recentSessions, setRecentSessions] = useState<GameSession[]>([])
  const [stats, setStats] = useState({
    totalDistance: 0,
    totalTime: 0,
    territoriesCaptured: 0,
    knowledgeOrbsCollected: 0,
    currentStreak: 0,
    level: 1
  })

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      // Load recent sessions
      const sessions = await GameSessionService.getUserSessions(user.id, 5)
      setRecentSessions(sessions)

      // Calculate statistics
      const totalDistance = sessions.reduce((sum, session) => sum + session.totalDistance, 0)
      const totalTime = sessions.reduce((sum, session) => sum + session.totalDuration, 0)

      setStats({
        totalDistance: totalDistance / 1000, // Convert to km
        totalTime: Math.round(totalTime / 1000 / 60), // Convert to minutes
        territoriesCaptured: user.statistics.territoriesCaptured,
        knowledgeOrbsCollected: user.statistics.knowledgeOrbsCollected,
        currentStreak: user.currentStreak,
        level: user.level
      })
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    try {
      const success = await updateProfile({ displayName })
      if (success) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (!user) {
    return (
      <div className="profile-screen">
        <div className="loading">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="profile-screen">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {user.displayName?.charAt(0) || '👤'}
          </div>
        </div>
        
        <div className="profile-info">
          {isEditing ? (
            <div className="edit-profile">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className="name-input"
              />
              <div className="edit-actions">
                <button onClick={handleSaveProfile} className="save-btn">Save</button>
                <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="profile-display">
              <h1>{user.displayName}</h1>
              <p className="user-level">Level {stats.level}</p>
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                ✏️ Edit
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-stats">
        <h2>Your Stats</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏃</div>
            <div className="stat-value">{stats.totalDistance.toFixed(1)} km</div>
            <div className="stat-label">Total Distance</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{formatTime(stats.totalTime)}</div>
            <div className="stat-label">Active Time</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">{stats.territoriesCaptured}</div>
            <div className="stat-label">Territories</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💡</div>
            <div className="stat-value">{stats.knowledgeOrbsCollected}</div>
            <div className="stat-label">Knowledge Orbs</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{user.totalPoints}</div>
            <div className="stat-label">Total Points</div>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <h2>Recent Activities</h2>
        {recentSessions.length === 0 ? (
          <div className="empty-activities">
            <p>No recent activities. Start your wellness journey!</p>
          </div>
        ) : (
          <div className="activities-list">
            {recentSessions.map(session => (
              <div key={session.id} className="activity-card">
                <div className="activity-icon">
                  {session.sessionType === 'WALK' ? '🚶' : 
                   session.sessionType === 'RUN' ? '🏃' : 
                   session.sessionType === 'BIKE' ? '🚴' : '🏃'}
                </div>
                <div className="activity-details">
                  <div className="activity-type">{session.sessionType}</div>
                  <div className="activity-stats">
                    {(session.totalDistance / 1000).toFixed(1)} km • {formatTime(Math.round(session.totalDuration / 1000 / 60))}
                  </div>
                  <div className="activity-date">
                    {session.startTime.toLocaleDateString()}
                  </div>
                </div>
                <div className="activity-points">
                  +{session.pointsEarned} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="profile-actions">
        <button className="action-btn secondary">
          🏆 View Achievements
        </button>
        <button className="action-btn secondary">
          📊 Detailed Stats
        </button>
        <button className="action-btn secondary">
          ⚙️ Settings
        </button>
      </div>
    </div>
  )
}

export default ProfileScreen