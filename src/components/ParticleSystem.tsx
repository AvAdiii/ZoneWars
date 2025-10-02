import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: {
    x: number;
    y: number;
  };
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  isActive: boolean;
  type: 'success' | 'achievement' | 'quest' | 'activity' | 'xp-gain';
  intensity?: number;
  position?: { x: number; y: number };
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  isActive,
  type,
  intensity = 1,
  position = { x: 50, y: 50 }
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const getParticleConfig = (type: string) => {
    switch (type) {
      case 'success':
        return {
          colors: ['#10b981', '#059669', '#34d399'],
          count: 15 * intensity,
          speed: 2,
          size: { min: 3, max: 8 },
          life: 60
        };
      case 'achievement':
        return {
          colors: ['#f59e0b', '#d97706', '#fbbf24'],
          count: 25 * intensity,
          speed: 3,
          size: { min: 4, max: 10 },
          life: 80
        };
      case 'quest':
        return {
          colors: ['#6366f1', '#4f46e5', '#818cf8'],
          count: 12 * intensity,
          speed: 1.5,
          size: { min: 2, max: 6 },
          life: 70
        };
      case 'activity':
        return {
          colors: ['#ef4444', '#dc2626', '#f87171'],
          count: 20 * intensity,
          speed: 2.5,
          size: { min: 3, max: 7 },
          life: 50
        };
      case 'xp-gain':
        return {
          colors: ['#8b5cf6', '#7c3aed', '#a78bfa'],
          count: 18 * intensity,
          speed: 2,
          size: { min: 4, max: 9 },
          life: 65
        };
      default:
        return {
          colors: ['#6366f1'],
          count: 10,
          speed: 2,
          size: { min: 3, max: 6 },
          life: 60
        };
    }
  };

  const createParticle = (id: number, config: any): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = config.speed * (0.5 + Math.random() * 0.5);
    
    return {
      id,
      x: position.x + (Math.random() - 0.5) * 20,
      y: position.y + (Math.random() - 0.5) * 20,
      size: config.size.min + Math.random() * (config.size.max - config.size.min),
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed - 1, // Slight upward bias
      },
      life: config.life,
      maxLife: config.life
    };
  };

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const config = getParticleConfig(type);
    const newParticles: Particle[] = [];

    // Create initial burst of particles
    for (let i = 0; i < config.count; i++) {
      newParticles.push(createParticle(i, config));
    }

    setParticles(newParticles);

    // Animation loop
    const animationInterval = setInterval(() => {
      setParticles(currentParticles => {
        return currentParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            velocity: {
              x: particle.velocity.x * 0.98, // Slight deceleration
              y: particle.velocity.y + 0.1 // Gravity effect
            },
            life: particle.life - 1
          }))
          .filter(particle => particle.life > 0);
      });
    }, 16); // ~60fps

    // Clear particles after animation completes
    const clearTimeoutId = setTimeout(() => {
      setParticles([]);
    }, config.life * 16 + 500);

    return () => {
      clearInterval(animationInterval);
      clearTimeout(clearTimeoutId);
    };
  }, [isActive, type, intensity, position.x, position.y]);

  if (!isActive || particles.length === 0) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 9999
    }}>
      {particles.map(particle => {
        const opacity = particle.life / particle.maxLife;
        const scale = 0.5 + (particle.life / particle.maxLife) * 0.5;
        
        return (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              borderRadius: '50%',
              opacity: opacity,
              transform: `scale(${scale})`,
              transition: 'none',
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`
            }}
          />
        );
      })}
    </div>
  );
};

export default ParticleSystem;