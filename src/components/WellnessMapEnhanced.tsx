import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle, useMapEvents } from 'react-leaflet';
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
interface Territory {
  id: string;
  coordinates: [number, number];
  owner: string | null;
  status: 'unclaimed' | 'owned' | 'contested';
  contestedUntil?: Date;
  hexVertices: [number, number][];
  value: number;
  captureTime?: Date;
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
  territories: Territory[];
  knowledgeOrbs: KnowledgeOrb[];
  onOrbClick: (orb: KnowledgeOrb) => void;
  onTerritoryClick: (territory: Territory) => void;
  isActivityActive: boolean;
  userStats: {
    level: number;
    xp: number;
    wellnessCapital: number;
  };
}

// Enhanced territory status colors with animations
const getTerritoryStyle = (territory: Territory) => {
  const baseStyle = {
    weight: 2,
    fillOpacity: 0.4,
  };

  switch (territory.status) {
    case 'unclaimed':
      return {
        ...baseStyle,
        color: '#64748b',
        fillColor: '#64748b',
        dashArray: '5, 5',
      };
    case 'contested':
      return {
        ...baseStyle,
        color: '#f59e0b',
        fillColor: '#f59e0b',
        weight: 3,
        dashArray: '10, 5',
        fillOpacity: 0.6,
      };
    default:
      return {
        ...baseStyle,
        color: territory.owner === 'user' ? '#3b82f6' : '#ef4444',
        fillColor: territory.owner === 'user' ? '#3b82f6' : '#ef4444',
        fillOpacity: territory.owner === 'user' ? 0.5 : 0.3,
      };
  }
};

// Enhanced Knowledge Orb icons with animations
const createEnhancedOrbIcon = (orb: KnowledgeOrb) => {
  const colors = {
    health: '#10b981',
    wealth: '#f59e0b',
    insurance: '#8b5cf6'
  };
  
  const emojis = {
    health: '🏃‍♂️',
    wealth: '💰',
    insurance: '🛡️'
  };

  const difficultyRings = {
    easy: 1,
    medium: 2,
    hard: 3
  };

  const color = colors[orb.type];
  const emoji = emojis[orb.type];
  const rings = difficultyRings[orb.difficulty];

  return L.divIcon({
    html: `
      <div class="orb-container" style="
        position: relative;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <!-- Difficulty rings -->
        ${Array.from({length: rings}, (_, i) => `
          <div style="
            position: absolute;
            width: ${50 + i * 10}px;
            height: ${50 + i * 10}px;
            border: 2px solid ${color};
            border-radius: 50%;
            opacity: ${0.3 - i * 0.1};
            animation: orbPulse ${2 + i * 0.5}s infinite;
          "></div>
        `).join('')}
        
        <!-- Main orb -->
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          border: 3px solid white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          z-index: 10;
          position: relative;
          ${orb.active ? `animation: orbGlow 1.5s infinite alternate;` : 'filter: grayscale(0.7); opacity: 0.6;'}
        ">
          ${emoji}
        </div>
        
        <!-- Reward indicator -->
        <div style="
          position: absolute;
          top: -8px;
          right: -8px;
          background: #fbbf24;
          color: white;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 10px;
          z-index: 11;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        ">+${orb.reward}</div>
      </div>
      
      <style>
        @keyframes orbPulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        
        @keyframes orbGlow {
          0% { box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
          100% { box-shadow: 0 4px 25px ${color}, 0 4px 35px ${color}; }
        }
      </style>
    `,
    className: 'knowledge-orb-enhanced',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

// Enhanced user avatar with level indicator
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
        <!-- Activity ring -->
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

// Map click handler component
function MapClickHandler({ onMapClick }: { onMapClick: (latlng: [number, number]) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

const WellnessMap: React.FC<WellnessMapProps> = ({
  userLocation,
  territories,
  knowledgeOrbs,
  onOrbClick,
  onTerritoryClick,
  isActivityActive,
  userStats
}) => {
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const handleMapClick = (_latlng: [number, number]) => {
    // Handle map clicks for future features
  };

  const handleTerritoryClick = (territory: Territory) => {
    onTerritoryClick(territory);
  };

  const handleOrbClick = (orb: KnowledgeOrb) => {
    if (orb.active) {
      onOrbClick(orb);
    }
  };

  if (!mapReady) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1e293b',
        color: 'white'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(255, 255, 255, 0.3)',
          borderTop: '4px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>Loading Wellness Realms...</div>
        <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '8px' }}>Preparing your adventure</div>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={userLocation}
        zoom={17}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={false}
        ref={mapRef}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map click handler */}
        <MapClickHandler onMapClick={handleMapClick} />

        {/* User Location with enhanced avatar */}
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

        {/* User Interaction Radius with enhanced styling */}
        <Circle
          center={userLocation}
          radius={150}
          pathOptions={{
            color: isActivityActive ? '#10b981' : '#6366f1',
            fillColor: isActivityActive ? '#10b981' : '#6366f1',
            fillOpacity: isActivityActive ? 0.15 : 0.1,
            weight: 2,
            dashArray: isActivityActive ? '15, 5' : '5, 5',
          }}
        />

        {/* Territory Hexagons with enhanced styling */}
        {territories.map((territory) => (
          <Polygon
            key={territory.id}
            positions={territory.hexVertices}
            pathOptions={getTerritoryStyle(territory)}
            eventHandlers={{
              click: () => handleTerritoryClick(territory),
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  weight: 4,
                  fillOpacity: 0.7,
                });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle(getTerritoryStyle(territory));
              },
            }}
          >
            <Popup closeButton={false}>
              <div style={{ 
                padding: '12px',
                minWidth: '200px',
                background: territory.owner === 'user' ? 
                  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' :
                  territory.status === 'contested' ?
                  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                  territory.status === 'unclaimed' ?
                  'linear-gradient(135deg, #64748b 0%, #475569 100%)' :
                  'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                borderRadius: '8px',
                margin: '-10px'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
                  🏰 Territory #{territory.id}
                </div>
                
                <div style={{ fontSize: '14px', marginBottom: '6px' }}>
                  Status: <span style={{ fontWeight: 'bold' }}>
                    {territory.status === 'unclaimed' ? '⚪ Unclaimed' :
                     territory.status === 'contested' ? '⚡ Contested!' :
                     territory.owner === 'user' ? '🔵 Your Territory' :
                     `🔴 Owned by ${territory.owner}`}
                  </span>
                </div>
                
                <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                  💎 Value: {territory.value} WC
                </div>
                
                {territory.status === 'contested' && territory.contestedUntil && (
                  <div style={{ 
                    fontSize: '12px', 
                    marginBottom: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    ⏱️ Contest ends in {Math.ceil((territory.contestedUntil.getTime() - Date.now()) / (1000 * 60 * 60))}h
                  </div>
                )}
                
                <button 
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                >
                  {territory.status === 'unclaimed' ? '⚡ Capture Territory' : 
                   territory.owner === 'user' ? '🛡️ Defend Territory' : 
                   '⚔️ Contest Territory'}
                </button>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Enhanced Knowledge Orbs */}
        {knowledgeOrbs.map((orb) => (
          <Marker
            key={orb.id}
            position={orb.coordinates}
            icon={createEnhancedOrbIcon(orb)}
            eventHandlers={{
              click: () => handleOrbClick(orb)
            }}
          >
            <Popup closeButton={false}>
              <div style={{ 
                padding: '12px',
                minWidth: '220px',
                background: `linear-gradient(135deg, ${
                  orb.type === 'health' ? '#10b981' : 
                  orb.type === 'wealth' ? '#f59e0b' : '#8b5cf6'
                } 0%, ${
                  orb.type === 'health' ? '#059669' : 
                  orb.type === 'wealth' ? '#d97706' : '#7c3aed'
                } 100%)`,
                color: 'white',
                borderRadius: '8px',
                margin: '-10px'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
                  {orb.type === 'health' ? '🏃‍♂️' : orb.type === 'wealth' ? '💰' : '🛡️'} {orb.title}
                </div>
                
                <div style={{ fontSize: '14px', marginBottom: '6px' }}>
                  Category: <span style={{ fontWeight: 'bold' }}>
                    {orb.type.charAt(0).toUpperCase() + orb.type.slice(1)}
                  </span>
                </div>
                
                <div style={{ fontSize: '14px', marginBottom: '6px' }}>
                  Difficulty: <span style={{ fontWeight: 'bold' }}>
                    {orb.difficulty === 'easy' ? '⭐ Easy' :
                     orb.difficulty === 'medium' ? '⭐⭐ Medium' : '⭐⭐⭐ Hard'}
                  </span>
                </div>
                
                <div style={{ fontSize: '12px', marginBottom: '8px', opacity: 0.9 }}>
                  {orb.description}
                </div>
                
                <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                  🎁 Reward: +{orb.reward} XP
                </div>
                
                {orb.active ? (
                  <button 
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#1f2937',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                    onClick={() => handleOrbClick(orb)}
                  >
                    🚀 Start Quest
                  </button>
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

      {/* Custom attribution */}
      <div style={{
        position: 'absolute',
        bottom: '5px',
        right: '5px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '10px',
        zIndex: 1000
      }}>
        🗺️ OpenStreetMap | 🎮 YouMatter: Wellness Realms
      </div>
    </div>
  );
};

export default WellnessMap;