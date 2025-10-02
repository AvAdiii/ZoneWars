import React, { useEffect, useState } from 'react'
import { useLocation } from '../../contexts/LocationContext'
import { useAuth } from '../../contexts/AuthContext'
import { WellnessAsset } from '../../types'
import './MapScreen.css'

const MapScreen = () => {
  const { user } = useAuth()
  const { currentLocation, isTracking, startTracking } = useLocation()
  const [assets, setAssets] = useState<WellnessAsset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<WellnessAsset | null>(null)

  useEffect(() => {
    // Load assets when location changes
    if (currentLocation && user) {
      console.log('Loading assets for location:', currentLocation)
    }
  }, [currentLocation, user])

  if (!user) {
    return (
      <div className="screen">
        <div className="card text-center">
          <h2>🗺️ Wellness Map</h2>
          <p>Please log in to access the interactive map and discover wellness opportunities around you.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="map-header mb-lg">
        <h1>🗺️ YouMatter: Wellness Realms</h1>
        <div className="location-info">
          {currentLocation ? (
            <p className="text-secondary">
              📍 Current Location: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
            </p>
          ) : (
            <p className="text-secondary">📍 Location not available</p>
          )}
        </div>
      </div>
      
      <div className="map-container card mb-lg">
        <div style={{ 
          height: '400px', 
          background: 'var(--background-secondary)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: 'var(--radius-md)',
          border: '2px dashed var(--primary-color)'
        }}>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
            <h3>🗺️ Interactive Wellness Map</h3>
            <p className="mb-md">Configure Google Maps API key to enable map features</p>
            <div className="flex flex-col gap-sm">
              <span>🎯 Territory capture zones</span>
              <span>💎 Knowledge orbs</span>
              <span>📍 Real-time location tracking</span>
              <span>🏆 Wellness activity hotspots</span>
            </div>
          </div>
        </div>
      </div>

      <div className="map-controls">
        <div className="tracking-controls mb-lg">
          <button 
            onClick={isTracking ? () => {} : startTracking}
            className={isTracking ? 'btn-success' : 'btn-primary'}
          >
            {isTracking ? '✅ Location Tracking Active' : '📍 Start Location Tracking'}
          </button>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">{assets.length}</div>
            <div className="stat-label">Wellness Assets</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">3</div>
            <div className="stat-label">Territories Nearby</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💎</div>
            <div className="stat-value">7</div>
            <div className="stat-label">Knowledge Orbs</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-value">1</div>
            <div className="stat-label">Active Sessions</div>
          </div>
        </div>
      </div>

      <div className="quick-actions mt-lg">
        <h3 className="mb-md">Quick Actions</h3>
        <div className="flex gap-md flex-col">
          <button className="btn-primary">
            🎯 Start Territory Capture
          </button>
          <button className="btn-secondary">
            💎 Collect Nearby Orbs
          </button>
          <button className="btn-secondary">
            🏃‍♀️ Begin Wellness Activity
          </button>
        </div>
      </div>

      {selectedAsset && (
        <div className="asset-info card mt-lg">
          <h3>{selectedAsset.name}</h3>
          <p>{selectedAsset.description}</p>
          <button onClick={() => setSelectedAsset(null)} className="btn-secondary">
            Close
          </button>
        </div>
      )}
    </div>
  )
}

export default MapScreen