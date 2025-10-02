import React, { useState, useEffect } from 'react';

interface NavigationControlsProps {
  userLocation: [number, number];
  onDirectionsRequest: (destination: [number, number]) => void;
  onCompassToggle: (enabled: boolean) => void;
  onMiniMapToggle: (enabled: boolean) => void;
  onProfileToggle: () => void;
  onSocialToggle: () => void;
  onRecenterMap?: () => void;
  isCompassEnabled: boolean;
  isMiniMapEnabled: boolean;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  userLocation,
  onDirectionsRequest,
  onCompassToggle,
  onMiniMapToggle,
  onProfileToggle,
  onSocialToggle,
  onRecenterMap,
  isCompassEnabled,
  isMiniMapEnabled
}) => {
  const [currentHeading, setCurrentHeading] = useState(0);

  // Simulate compass heading updates
  useEffect(() => {
    if (isCompassEnabled) {
      const interval = setInterval(() => {
        setCurrentHeading(prev => (prev + Math.random() * 10 - 5) % 360);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCompassEnabled]);

  return (
    <>
      {/* Vertical Button Panel on Left Side - Moved down to avoid conflicts */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Compass Toggle */}
        <button
          onClick={() => onCompassToggle(!isCompassEnabled)}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            border: isCompassEnabled ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
            background: isCompassEnabled ? 
              'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 
              'rgba(255, 255, 255, 0.9)',
            color: isCompassEnabled ? 'white' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'all 0.3s ease',
            boxShadow: isCompassEnabled ? 
              '0 4px 15px rgba(99, 102, 241, 0.4)' : 
              '0 4px 12px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
          title={isCompassEnabled ? 'Disable Compass' : 'Enable Compass'}
        >
          🧭
        </button>

        {/* Mini-Map Toggle */}
        <button
          onClick={() => onMiniMapToggle(!isMiniMapEnabled)}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            border: isMiniMapEnabled ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
            background: isMiniMapEnabled ? 
              'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
              'rgba(255, 255, 255, 0.9)',
            color: isMiniMapEnabled ? 'white' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'all 0.3s ease',
            boxShadow: isMiniMapEnabled ? 
              '0 4px 15px rgba(16, 185, 129, 0.4)' : 
              '0 4px 12px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
          title={isMiniMapEnabled ? 'Hide Mini Map' : 'Show Mini Map'}
        >
          🗺️
        </button>

        {/* Profile Toggle */}
        <button
          onClick={onProfileToggle}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
            backdropFilter: 'blur(10px)'
          }}
          title="Open Profile"
        >
          👤
        </button>

        {/* Social Toggle */}
        <button
          onClick={onSocialToggle}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
            backdropFilter: 'blur(10px)'
          }}
          title="Open Social Panel"
        >
          👥
        </button>

        {/* Re-center Map Button */}
        {onRecenterMap && (
          <button
            onClick={onRecenterMap}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
              backdropFilter: 'blur(10px)'
            }}
            title="Recenter map to your location"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            🎯
          </button>
        )}
      </div>

      {/* Compass Detail View - Repositioned */}
      {isCompassEnabled && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '90px',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: '180px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white',
            transform: `rotate(${currentHeading}deg)`,
            transition: 'transform 0.5s ease'
          }}>
            🧭
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
              Compass Active
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {Math.round(currentHeading)}° bearing
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationControls;