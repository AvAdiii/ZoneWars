import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingScreen from '../common/LoadingScreen'
import LoginScreen from '../auth/LoginScreen'
import MapScreen from '../map/MapScreen'
import CommunityScreen from '../social/CommunityScreen'
import ProfileScreen from '../profile/ProfileScreen'
import ActivityScreen from '../activity/ActivityScreen'
import AchievementsScreen from '../achievements/AchievementsScreen'
import NotificationsScreen from '../notifications/NotificationsScreen'
import SettingsScreen from '../settings/SettingsScreen'
import KnowledgeOrbScreen from '../orbs/KnowledgeOrbScreen'
import Navigation from '../navigation/Navigation'

const AppRouter = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/map" replace />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/community" element={<CommunityScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/activity" element={<ActivityScreen />} />
          <Route path="/achievements" element={<AchievementsScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/orb/:orbId" element={<KnowledgeOrbScreen />} />
          <Route path="*" element={<Navigate to="/map" replace />} />
        </Routes>
      </div>
      <Navigation />
    </div>
  )
}

export default AppRouter