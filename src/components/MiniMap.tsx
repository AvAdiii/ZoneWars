import React from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface MiniMapProps {
  userLocation: [number, number];
  territories: Array<{
    id: string;
    coordinates: [number, number];
    status: 'unclaimed' | 'owned' | 'contested';
    owner: string | null;
  }>;
  knowledgeOrbs: Array<{
    id: string;
    coordinates: [number, number];
    type: 'health' | 'wealth' | 'insurance';
    active: boolean;
  }>;
  isVisible: boolean;
  onLocationClick: (coordinates: [number, number]) => void;
}

// Simplified icons for mini-map
const createMiniUserIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    className: 'mini-user-marker',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

const createMiniTerritoryIcon = (status: string, owner: string | null) => {
  const getColor = () => {
    if (status === 'unclaimed') return '#64748b';
    if (status === 'contested') return '#f59e0b';
    return owner === 'user' ? '#3b82f6' : '#ef4444';
  };

  return L.divIcon({
    html: `
      <div style="
        width: 8px;
        height: 8px;
        background: ${getColor()};
        border: 1px solid white;
        ${status === 'unclaimed' ? 'border-radius: 50%;' : ''}
        ${status === 'contested' ? 'transform: rotate(45deg);' : ''}
      "></div>
    `,
    className: 'mini-territory-marker',
    iconSize: [8, 8],
    iconAnchor: [4, 4]
  });
};

const createMiniOrbIcon = (type: string, active: boolean) => {
  const colors = {
    health: '#10b981',
    wealth: '#f59e0b',
    insurance: '#8b5cf6'
  };

  return L.divIcon({
    html: `
      <div style="
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${colors[type as keyof typeof colors]};
        border: 1px solid white;
        opacity: ${active ? 1 : 0.5};
        ${active ? 'box-shadow: 0 0 4px ' + colors[type as keyof typeof colors] + ';' : ''}
      "></div>
    `,
    className: 'mini-orb-marker',
    iconSize: [6, 6],
    iconAnchor: [3, 3]
  });
};

// Map click handler component for mini-map
function MiniMapClickHandler({ onMapClick }: { onMapClick: (latlng: [number, number]) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

const MiniMap: React.FC<MiniMapProps> = ({
  userLocation,
  territories,
  knowledgeOrbs,
  isVisible,
  onLocationClick
}) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      width: '200px',
      height: '200px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '8px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Mini Map Header */}
      <div style={{
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: '8px',
        textAlign: 'center',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '4px'
      }}>
        🗺️ Overview Map
      </div>

      {/* Map Container */}
      <div style={{ 
        width: '100%', 
        height: 'calc(100% - 30px)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <MapContainer
          center={userLocation}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          dragging={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Map click handler */}
          <MiniMapClickHandler onMapClick={onLocationClick} />

          {/* User Location */}
          <Marker 
            position={userLocation} 
            icon={createMiniUserIcon()}
          />

          {/* User Range Circle */}
          <Circle
            center={userLocation}
            radius={150}
            pathOptions={{
              color: '#6366f1',
              fillColor: '#6366f1',
              fillOpacity: 0.1,
              weight: 1,
            }}
          />

          {/* Territories */}
          {territories.map((territory) => (
            <Marker
              key={territory.id}
              position={territory.coordinates}
              icon={createMiniTerritoryIcon(territory.status, territory.owner)}
            />
          ))}

          {/* Knowledge Orbs */}
          {knowledgeOrbs.map((orb) => (
            <Marker
              key={orb.id}
              position={orb.coordinates}
              icon={createMiniOrbIcon(orb.type, orb.active)}
            />
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        right: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '6px',
        padding: '4px 6px',
        fontSize: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: '#6366f1',
            border: '1px solid white'
          }}></div>
          <span>You</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ 
            width: '6px', 
            height: '6px', 
            background: '#64748b',
            border: '1px solid white'
          }}></div>
          <span>Territory</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ 
            width: '4px', 
            height: '4px', 
            borderRadius: '50%', 
            background: '#10b981',
            border: '1px solid white'
          }}></div>
          <span>Orb</span>
        </div>
      </div>
    </div>
  );
};

export default MiniMap;