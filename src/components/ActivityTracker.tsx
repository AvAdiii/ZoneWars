import React, { useState, useEffect } from 'react';

interface ActivityMetrics {
  steps: number;
  distance: number; // in km
  calories: number;
  activeTime: number; // in minutes
  heartRate: number;
  pace: number; // minutes per km
}

interface ActivityGoals {
  dailySteps: number;
  dailyDistance: number;
  dailyCalories: number;
  weeklyActiveTime: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'steps' | 'distance' | 'calories' | 'time' | 'streak' | 'special';
  requirement: number;
  current: number;
  unlocked: boolean;
  unlockedDate?: Date;
}

interface ActivityTrackerProps {
  isActive: boolean;
  onActivityToggle: (active: boolean) => void;
  userLocation: [number, number];
  onMetricsUpdate: (metrics: ActivityMetrics) => void;
}

const ActivityTracker: React.FC<ActivityTrackerProps> = ({
  isActive,
  onActivityToggle,
  userLocation,
  onMetricsUpdate
}) => {
  const [metrics, setMetrics] = useState<ActivityMetrics>({
    steps: 0,
    distance: 0,
    calories: 0,
    activeTime: 0,
    heartRate: 75,
    pace: 0
  });

  const [lastLocation, setLastLocation] = useState<[number, number] | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  // Calculate distance between two coordinates in meters
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Convert distance to steps (approximate)
  const distanceToSteps = (distanceMeters: number): number => {
    const averageStepLength = 0.75; // meters per step
    return Math.round(distanceMeters / averageStepLength);
  };

  // Calculate calories burned based on distance and activity
  const calculateCalories = (distanceKm: number): number => {
    const caloriesPerKm = 60; // Approximate calories per km for walking
    return Math.round(distanceKm * caloriesPerKm);
  };

  // Track real location changes
  useEffect(() => {
    if (!isActive || !userLocation) return;

    const currentTime = Date.now();
    
    if (lastLocation) {
      const distanceMeters = calculateDistance(
        lastLocation[0], lastLocation[1],
        userLocation[0], userLocation[1]
      );

      // Only update if user moved at least 3 meters (to filter GPS noise)
      if (distanceMeters >= 3) {
        const distanceKm = distanceMeters / 1000;
        const timeDiffMinutes = (currentTime - lastUpdateTime) / (1000 * 60);
        const newSteps = distanceToSteps(distanceMeters);
        const newCalories = calculateCalories(distanceKm);

        setMetrics(prev => {
          const newMetrics = {
            steps: prev.steps + newSteps,
            distance: prev.distance + distanceKm,
            calories: prev.calories + newCalories,
            activeTime: prev.activeTime + timeDiffMinutes,
            heartRate: Math.max(60, Math.min(180, prev.heartRate + (Math.random() * 10 - 5))),
            pace: distanceKm > 0 ? (timeDiffMinutes / distanceKm) : 0
          };

          onMetricsUpdate(newMetrics);
          return newMetrics;
        });

        setLastUpdateTime(currentTime);
      }
    }

    setLastLocation(userLocation);
  }, [userLocation, isActive, lastLocation, lastUpdateTime, onMetricsUpdate]);

  const [goals] = useState<ActivityGoals>({
    dailySteps: 10000,
    dailyDistance: 5.0,
    dailyCalories: 400,
    weeklyActiveTime: 150
  });

  const [todayMetrics, setTodayMetrics] = useState<ActivityMetrics>({
    steps: 7834,
    distance: 5.2,
    calories: 312,
    activeTime: 45,
    heartRate: 82,
    pace: 6.5
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_steps',
      title: 'First Steps',
      description: 'Take your first 100 steps',
      icon: '👣',
      type: 'steps',
      requirement: 100,
      current: 7834,
      unlocked: true,
      unlockedDate: new Date('2024-01-15')
    },
    {
      id: 'walker',
      title: 'Daily Walker',
      description: 'Walk 5,000 steps in a day',
      icon: '🚶‍♂️',
      type: 'steps',
      requirement: 5000,
      current: 7834,
      unlocked: true,
      unlockedDate: new Date('2024-01-18')
    },
    {
      id: 'step_master',
      title: 'Step Master',
      description: 'Reach 10,000 steps in a day',
      icon: '🏃‍♂️',
      type: 'steps',
      requirement: 10000,
      current: 7834,
      unlocked: false
    },
    {
      id: 'distance_runner',
      title: 'Distance Runner',
      description: 'Cover 10km in a single activity',
      icon: '🏃‍♀️',
      type: 'distance',
      requirement: 10,
      current: 5.2,
      unlocked: false
    },
    {
      id: 'calorie_burner',
      title: 'Calorie Burner',
      description: 'Burn 500 calories in a day',
      icon: '🔥',
      type: 'calories',
      requirement: 500,
      current: 312,
      unlocked: false
    },
    {
      id: 'consistency_champion',
      title: 'Consistency Champion',
      description: 'Maintain a 7-day activity streak',
      icon: '📅',
      type: 'streak',
      requirement: 7,
      current: 4,
      unlocked: false
    }
  ]);

  const [currentStreak] = useState(4);
  const [showAchievements, setShowAchievements] = useState(false);

  // Track active time when activity is enabled
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setMetrics(prev => {
          const newMetrics = {
            ...prev,
            activeTime: prev.activeTime + 0.25, // Add 15 seconds = 0.25 minutes
            heartRate: Math.max(60, Math.min(180, prev.heartRate + (Math.random() * 5 - 2.5))), // Slight heart rate variation
          };

          onMetricsUpdate(newMetrics);
          return newMetrics;
        });
      }, 15000); // Update every 15 seconds for active time
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, onMetricsUpdate]);

  // Check for achievement unlocks
  useEffect(() => {
    setAchievements(prev => prev.map(achievement => {
      if (!achievement.unlocked) {
        const currentValue = achievement.type === 'steps' ? todayMetrics.steps :
                           achievement.type === 'distance' ? todayMetrics.distance :
                           achievement.type === 'calories' ? todayMetrics.calories :
                           achievement.type === 'time' ? todayMetrics.activeTime :
                           achievement.type === 'streak' ? currentStreak : 0;

        if (currentValue >= achievement.requirement) {
          return {
            ...achievement,
            current: currentValue,
            unlocked: true,
            unlockedDate: new Date()
          };
        }
        return { ...achievement, current: currentValue };
      }
      return achievement;
    }));
  }, [todayMetrics, currentStreak]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min(100, (current / goal) * 100);
  };

  const getActivityTypeIcon = (isActive: boolean) => {
    return isActive ? '🏃‍♂️' : '⏸️';
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '320px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      zIndex: 1000
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🏃‍♂️ Activity Tracker
        </h3>
        <button
          onClick={() => setShowAchievements(!showAchievements)}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#f59e0b',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="View Achievements"
        >
          🏆
        </button>
      </div>

      {/* Activity Control */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: isActive ? '#dcfce7' : '#f8fafc',
        borderRadius: '12px',
        border: `2px solid ${isActive ? '#10b981' : '#e5e7eb'}`
      }}>
        <button
          onClick={() => onActivityToggle(!isActive)}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isActive ? '#10b981' : '#64748b',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          {getActivityTypeIcon(isActive)}
        </button>
        <div>
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1e293b'
          }}>
            {isActive ? 'Activity in Progress' : 'Start Activity'}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#64748b'
          }}>
            {isActive ? `Active: ${formatTime(metrics.activeTime)}` : 'Tap to begin tracking'}
          </div>
        </div>
      </div>

      {/* Current Session Metrics (when active) */}
      {isActive && (
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f0f9ff',
          borderRadius: '12px',
          border: '2px solid #0ea5e9'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#0c4a6e',
            marginBottom: '10px'
          }}>
            Current Session
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px'
          }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0c4a6e' }}>
                {Math.round(metrics.steps)}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Steps</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0c4a6e' }}>
                {metrics.distance.toFixed(2)}km
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Distance</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0c4a6e' }}>
                {Math.round(metrics.calories)}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Calories</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0c4a6e' }}>
                {metrics.heartRate} bpm
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Heart Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Progress */}
      <div style={{
        marginBottom: '20px'
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📊 Today's Progress
          <span style={{
            fontSize: '12px',
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '10px'
          }}>
            {currentStreak} day streak
          </span>
        </div>

        {/* Steps Progress */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>👣 Steps</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>
              {Math.round(todayMetrics.steps).toLocaleString()} / {goals.dailySteps.toLocaleString()}
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${getProgressPercentage(todayMetrics.steps, goals.dailySteps)}%`,
              height: '100%',
              backgroundColor: '#10b981',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* Distance Progress */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>🏃‍♂️ Distance</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>
              {todayMetrics.distance.toFixed(1)}km / {goals.dailyDistance}km
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${getProgressPercentage(todayMetrics.distance, goals.dailyDistance)}%`,
              height: '100%',
              backgroundColor: '#0ea5e9',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* Calories Progress */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>🔥 Calories</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>
              {Math.round(todayMetrics.calories)} / {goals.dailyCalories}
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${getProgressPercentage(todayMetrics.calories, goals.dailyCalories)}%`,
              height: '100%',
              backgroundColor: '#f59e0b',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      </div>

      {/* Achievements Panel */}
      {showAchievements && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏆 Achievements
          </div>
          
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: achievement.unlocked ? '#dcfce7' : '#f8fafc',
                borderRadius: '8px',
                border: `1px solid ${achievement.unlocked ? '#10b981' : '#e5e7eb'}`,
                opacity: achievement.unlocked ? 1 : 0.7
              }}
            >
              <div style={{ fontSize: '24px' }}>
                {achievement.unlocked ? achievement.icon : '🔒'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: achievement.unlocked ? '#166534' : '#64748b'
                }}>
                  {achievement.title}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '4px'
                }}>
                  {achievement.description}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: achievement.unlocked ? '#166534' : '#64748b'
                }}>
                  {achievement.unlocked ? 
                    `Unlocked ${achievement.unlockedDate?.toLocaleDateString()}` :
                    `${achievement.current} / ${achievement.requirement}`
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTracker;