import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Types
interface ClaimedTerritory {
  id: string;
  boundary: [number, number][];
  area: number;
  claimedAt: Date;
  center: [number, number];
}

interface KnowledgeOrb {
  id: string;
  coordinates: [number, number];
  type: 'health' | 'wealth' | 'insurance';
  title: string;
  active: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
  description: string;
}

interface WellnessMapProps {
  userLocation: [number, number];
  knowledgeOrbs: KnowledgeOrb[];
  onOrbClick: (orb: KnowledgeOrb) => void;
  onTerritoryCapture: (territory: ClaimedTerritory) => void;
  isActivityActive: boolean;
  userStats: {
    level: number;
    xp: number;
    wellnessCapital: number;
  };
}

// Location tracking component
const LocationTracker: React.FC<{
  onLocationUpdate: (location: [number, number]) => void;
  onPathComplete: (path: [number, number][]) => void;
  isActivityActive: boolean;
  userLocation: [number, number];
}> = ({ onLocationUpdate, onPathComplete, isActivityActive, userLocation }) => {
  const [currentPath, setCurrentPath] = useState<[number, number][]>([]);

  useEffect(() => {
    let watchId: number;

    // Only start tracking if activity is active
    if (isActivityActive && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          
          onLocationUpdate(newLocation);
          
          setCurrentPath(prev => {
            const updated = [...prev, newLocation];
            
            // If path gets long enough (50+ points), consider it complete
            if (updated.length >= 50) {
              onPathComplete(updated);
              return [newLocation]; // Start new path
            }
            
            return updated;
          });
        },
        (error) => {
          console.error('Location error:', error);
          // Fall back to using the provided userLocation
          onLocationUpdate(userLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 1000
        }
      );
    } else if (!isActivityActive) {
      // Clear path when activity stops
      setCurrentPath([]);
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [onLocationUpdate, onPathComplete, isActivityActive, userLocation]);

  return null;
};

// Create user avatar icon
const createUserAvatar = (level: number, isActivityActive: boolean) => {
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${isActivityActive ? `
          <div style="
            position: absolute;
            width: 70px;
            height: 70px;
            border: 3px solid #10b981;
            border-radius: 50%;
            animation: activityPulse 1s infinite;
          "></div>
        ` : ''}
        
        <!-- Level ring -->
        <div style="
          position: absolute;
          width: 60px;
          height: 60px;
          border: 4px solid #6366f1;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.1);
        "></div>
        
        <!-- Avatar -->
        <div style="
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          z-index: 10;
          position: relative;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        ">
          🧑‍💼
        </div>
        
        <!-- Level badge -->
        <div style="
          position: absolute;
          top: -5px;
          right: -5px;
          background: #f59e0b;
          color: white;
          font-size: 12px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 10px;
          z-index: 11;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        ">${level}</div>
      </div>
      
      <style>
        @keyframes activityPulse {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.7; }
        }
      </style>
    `,
    className: 'user-avatar-enhanced',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25]
  });
};

// Create knowledge orb icon
const createKnowledgeOrbIcon = (orb: KnowledgeOrb) => {
  const emoji = orb.type === 'health' ? '🏥' : orb.type === 'wealth' ? '💰' : '🛡️';
  const color = orb.type === 'health' ? '#10b981' : orb.type === 'wealth' ? '#f59e0b' : '#8b5cf6';
  
  return L.divIcon({
    html: `
      <div style="
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        border: 2px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        opacity: ${orb.active ? 1 : 0.6};
        animation: ${orb.active ? 'glow 1.5s infinite alternate' : 'none'};
      ">
        ${emoji}
      </div>
      <style>
        @keyframes glow {
          0% { box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
          100% { box-shadow: 0 2px 20px ${color}, 0 2px 30px ${color}; }
        }
      </style>
    `,
    className: 'knowledge-orb-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const WellnessMap = forwardRef<any, WellnessMapProps>(({
  userLocation,
  knowledgeOrbs,
  onOrbClick,
  onTerritoryCapture,
  isActivityActive,
  userStats
}, ref) => {
  const [currentPath, setCurrentPath] = useState<[number, number][]>([]);
  const [claimedTerritories, setClaimedTerritories] = useState<ClaimedTerritory[]>([]);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [nearbyOrbs, setNearbyOrbs] = useState<KnowledgeOrb[]>([]);
  const mapRef = useRef<any>(null);

  // Expose recenter function to parent
  useImperativeHandle(ref, () => ({
    recenterMap: () => {
      if (mapRef.current) {
        mapRef.current.setView(userLocation, 17);
      }
    }
  }));

  // Check for location permission on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setIsLocationEnabled(true),
        () => setIsLocationEnabled(false)
      );
    }
  }, []);

  // Clear path when activity stops
  useEffect(() => {
    if (!isActivityActive) {
      setCurrentPath([]);
    }
  }, [isActivityActive]);

  // Find nearby orbs - with 5 second delay after location becomes active
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLocationEnabled) {
      // Wait 5 seconds after location becomes active before showing orbs
      timeoutId = setTimeout(() => {
        const nearby = knowledgeOrbs.filter(orb => {
          const distance = calculateDistance(userLocation, orb.coordinates);
          return distance < 100; // Within 100 meters
        });
        setNearbyOrbs(nearby);
      }, 5000); // 5 second delay
    } else {
      // Immediately clear orbs when location is disabled
      setNearbyOrbs([]);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLocationEnabled, userLocation, knowledgeOrbs]);

  const calculateDistance = (pos1: [number, number], pos2: [number, number]) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = pos1[0] * Math.PI/180;
    const φ2 = pos2[0] * Math.PI/180;
    const Δφ = (pos2[0]-pos1[0]) * Math.PI/180;
    const Δλ = (pos2[1]-pos1[1]) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const handleLocationUpdate = (location: [number, number]) => {
    // Only update path if activity is active
    if (isActivityActive) {
      setCurrentPath(prev => [...prev, location]);
    }
  };

  const handlePathComplete = (path: [number, number][]) => {
    // Create territory from completed path
    if (path.length >= 10) { // Minimum path length
      const territory: ClaimedTerritory = {
        id: `territory-${Date.now()}`,
        boundary: path,
        area: calculatePolygonArea(path),
        claimedAt: new Date(),
        center: calculateCentroid(path)
      };
      
      setClaimedTerritories(prev => [...prev, territory]);
      onTerritoryCapture(territory);
    }
    
    // Reset path
    setCurrentPath([]);
  };

  const calculatePolygonArea = (vertices: [number, number][]) => {
    // Simple polygon area calculation
    let area = 0;
    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      area += vertices[i][0] * vertices[j][1];
      area -= vertices[j][0] * vertices[i][1];
    }
    return Math.abs(area) / 2;
  };

  const calculateCentroid = (vertices: [number, number][]): [number, number] => {
    const x = vertices.reduce((sum, vertex) => sum + vertex[0], 0) / vertices.length;
    const y = vertices.reduce((sum, vertex) => sum + vertex[1], 0) / vertices.length;
    return [x, y];
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* Location Status Indicator - positioned to avoid zoom button */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '90px',
        zIndex: 1000,
        backgroundColor: isLocationEnabled ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        {isLocationEnabled ? '📍 Location Active' : '❌ Location Disabled'}
      </div>

      {/* Path Stats */}
      {isActivityActive && currentPath.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: 'rgba(99, 102, 241, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          🎯 Path: {currentPath.length} points
        </div>
      )}

      {/* Territory Stats */}
      {claimedTerritories.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 1000,
          backgroundColor: 'rgba(139, 92, 246, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          🏆 Territories: {claimedTerritories.length}
        </div>
      )}

      {/* Orbs Alert - Shows available orbs nearby */}
      {isLocationEnabled && nearbyOrbs.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '280px',
          zIndex: 1000,
          backgroundColor: 'rgba(236, 72, 153, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          ⭐ {nearbyOrbs.length} orb{nearbyOrbs.length !== 1 ? 's' : ''} nearby!
        </div>
      )}

      <MapContainer
        ref={mapRef}
        center={userLocation}
        zoom={17}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={false}
      >
        {/* Location tracking */}
        <LocationTracker 
          onLocationUpdate={handleLocationUpdate}
          onPathComplete={handlePathComplete}
          isActivityActive={isActivityActive}
          userLocation={userLocation}
        />

        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        <Marker 
          position={userLocation} 
          icon={createUserAvatar(userStats.level, isActivityActive)}
          zIndexOffset={1000}
        >
          <Popup closeButton={false}>
            <div style={{ 
              textAlign: 'center', 
              padding: '8px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              borderRadius: '8px',
              margin: '-10px'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>You are here!</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Level {userStats.level} - Wellness Voyager</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                💰 {userStats.wellnessCapital.toLocaleString()} WC
              </div>
              {isActivityActive && (
                <div style={{ 
                  fontSize: '12px', 
                  marginTop: '4px',
                  backgroundColor: 'rgba(16, 185, 129, 0.8)',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}>
                  🏃 Activity in progress!
                </div>
              )}
            </div>
          </Popup>
        </Marker>

        {/* Current Path Visualization */}
        {isActivityActive && currentPath.length > 1 && (
          <Polyline
            positions={currentPath}
            pathOptions={{
              color: '#6366f1',
              weight: 4,
              opacity: 0.8,
              dashArray: '10, 5'
            }}
          />
        )}

        {/* Claimed Territories */}
        {claimedTerritories.map((territory) => (
          <Polygon
            key={territory.id}
            positions={territory.boundary}
            pathOptions={{
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.2,
              weight: 2
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>🏆 Your Territory</strong><br />
                <small>Area: {territory.area.toFixed(2)} sq units</small><br />
                <small>Claimed: {territory.claimedAt.toLocaleTimeString()}</small>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Knowledge Orbs */}
        {knowledgeOrbs.map((orb) => (
          <Marker
            key={orb.id}
            position={orb.coordinates}
            icon={createKnowledgeOrbIcon(orb)}
            eventHandlers={{
              click: () => onOrbClick(orb)
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>{orb.title}</strong><br />
                <span style={{ 
                  color: orb.type === 'health' ? '#10b981' : orb.type === 'wealth' ? '#f59e0b' : '#8b5cf6',
                  fontWeight: 'bold'
                }}>
                  {orb.type.charAt(0).toUpperCase() + orb.type.slice(1)} Orb
                </span><br />
                {orb.active ? (
                  <>
                    <small>{orb.description}</small><br />
                    <div style={{
                      marginTop: '8px',
                      padding: '4px 8px',
                      backgroundColor: orb.type === 'health' ? '#10b981' : orb.type === 'wealth' ? '#f59e0b' : '#8b5cf6',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      Reward: +{orb.reward} WC
                    </div>
                  </>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}>
                    💤 Orb temporarily inactive
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
});

WellnessMap.displayName = 'WellnessMap';

export default WellnessMap;