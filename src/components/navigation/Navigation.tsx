// Navigation component - bottom navigation like Android app
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Navigation.css'

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navigationItems = [
    {
      id: 'map',
      path: '/map',
      icon: '🗺️',
      label: 'Map',
      isActive: location.pathname === '/map'
    },
    {
      id: 'community',
      path: '/community',
      icon: '👥',
      label: 'Community',
      isActive: location.pathname === '/community'
    },
    {
      id: 'activity',
      path: '/activity',
      icon: '🏃',
      label: 'Activity',
      isActive: location.pathname === '/activity'
    },
    {
      id: 'achievements',
      path: '/achievements',
      icon: '🏆',
      label: 'Achievements',
      isActive: location.pathname === '/achievements'
    },
    {
      id: 'profile',
      path: '/profile',
      icon: '👤',
      label: 'Profile',
      isActive: location.pathname === '/profile'
    }
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <nav className="bottom-navigation">
      <div className="nav-container">
        {navigationItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${item.isActive ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
            aria-label={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default Navigation