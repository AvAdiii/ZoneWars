import React, { useState, useEffect } from 'react';

interface NavigationControlsProps {
  userLocation: [number, number];
  onDirectionsRequest: (destination: [number, number]) => void;
  onCompassToggle: (enabled: boolean) => void;
  onMiniMapToggle: (enabled: boolean) => void;
  onProfileToggle: () => void;
  onSocialToggle: () => void;
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'orb': return '🔮';
      case 'territory': return '🏰';
      case 'activity': return '🏃‍♂️';
      case 'poi': return '📍';
      default: return '📍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'orb': return '#8b5cf6';
      case 'territory': return '#3b82f6';
      case 'activity': return '#10b981';
      case 'poi': return '#f59e0b';
      default: return '#64748b';
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Main Navigation Bar */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Compass */}
        <button
          onClick={() => onCompassToggle(!isCompassEnabled)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: isCompassEnabled ? 
              'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 
              'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
            color: isCompassEnabled ? 'white' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transform: isCompassEnabled ? `rotate(${currentHeading}deg)` : 'none',
            transition: 'all 0.3s ease',
            boxShadow: isCompassEnabled ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none'
          }}
          title={isCompassEnabled ? 'Disable Compass' : 'Enable Compass'}
        >
          🧭
        </button>

        {/* Mini-Map Toggle */}
        <button
          onClick={() => onMiniMapToggle(!isMiniMapEnabled)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: 'none',
            background: isMiniMapEnabled ? 
              'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
              'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
            color: isMiniMapEnabled ? 'white' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'all 0.3s ease',
            boxShadow: isMiniMapEnabled ? '0 4px 15px rgba(16, 185, 129, 0.3)' : 'none'
          }}
          title={isMiniMapEnabled ? 'Hide Mini Map' : 'Show Mini Map'}
        >
          🗺️
        </button>

        {/* Profile Panel Toggle */}
        <button
          onClick={onProfileToggle}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
          }}
          title="Open Profile Panel"
        >
          👤
        </button>

        {/* Social Panel Toggle */}
        <button
          onClick={onSocialToggle}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
          }}
          title="Open Social Hub"
        >
          🤝
        </button>
      </div>


        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {searchResults.map((result) => (
            <div
              key={result.id}
              onClick={() => {
                onDirectionsRequest(result.coordinates);
                setIsSearchExpanded(false);
                setSearchQuery(result.name);
              }}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f1f5f9',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: getTypeColor(result.type),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}>
                {getTypeIcon(result.type)}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: '14px',
                  color: '#1e293b',
                  marginBottom: '2px'
                }}>
                  {result.name}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#64748b'
                }}>
                  {result.distance.toFixed(1)} km away • {result.type}
                </div>
              </div>
              
              <button
                style={{
                  width: '28px',
                  height: '28px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}
                title="Get Directions"
              >
                📍
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Click outside to close search */}
      {isSearchExpanded && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1
          }}
          onClick={() => setIsSearchExpanded(false)}
        />
      )}

      {/* Compass Detail View */}
      {isCompassEnabled && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '0',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minWidth: '200px'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '12px'
          }}>
            <div style={{
              fontSize: '48px',
              transform: `rotate(${currentHeading}deg)`,
              transition: 'transform 0.5s ease',
              marginBottom: '8px'
            }}>
              🧭
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1e293b'
            }}>
              {Math.round(currentHeading)}°
            </div>
            <div style={{
              fontSize: '12px',
              color: '#64748b'
            }}>
              {currentHeading >= 337.5 || currentHeading < 22.5 ? 'North' :
               currentHeading >= 22.5 && currentHeading < 67.5 ? 'Northeast' :
               currentHeading >= 67.5 && currentHeading < 112.5 ? 'East' :
               currentHeading >= 112.5 && currentHeading < 157.5 ? 'Southeast' :
               currentHeading >= 157.5 && currentHeading < 202.5 ? 'South' :
               currentHeading >= 202.5 && currentHeading < 247.5 ? 'Southwest' :
               currentHeading >= 247.5 && currentHeading < 292.5 ? 'West' : 'Northwest'}
            </div>
          </div>
          
          <div style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '12px',
            fontSize: '12px',
            color: '#64748b'
          }}>
            <div>📍 Current Location:</div>
            <div style={{ fontFamily: 'monospace', marginTop: '4px' }}>
              {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationControls;