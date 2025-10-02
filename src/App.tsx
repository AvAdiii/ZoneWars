import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import WellnessMap from './components/WellnessMap';
import NavigationControls from './components/NavigationControls';
import MiniMap from './components/MiniMap';
import ActivityTracker from './components/ActivityTracker';
import ProfilePanel from './components/ProfilePanel';
import SocialPanel from './components/SocialPanel';
import ParticleSystem from './components/ParticleSystem';
import { SlideInElement } from './components/AnimationWrapper';
import { QuestManager, Quest } from './data/questData';
import './App.css';

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

interface UserStats {
  level: number;
  xp: number;
  wellnessCapital: number;
  totalDistance: number;
  territoriesOwned: number;
}

interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  type: 'quiz_completion' | 'achievement' | 'territory_claim' | 'general';
  content: string;
  score?: number;
  xpGained?: number;
  questTitle?: string;
  timestamp: Date;
  avatar: {
    character: string;
    color: string;
    accessory: string;
  };
}

// Function to calculate reward for captured territory
const calculateTerritoryReward = (area: number): number => {
  return Math.floor(area * 100000); // Scale area to reasonable XP reward
};

// Main Map Screen Component with Real OpenStreetMap
function MapScreen({ 
  communityPosts, 
  setCommunityPosts 
}: { 
  communityPosts: CommunityPost[]; 
  setCommunityPosts: React.Dispatch<React.SetStateAction<CommunityPost[]>>; 
}) {
  const [userStats] = useState<UserStats>({
    level: 12,
    xp: 2450,
    wellnessCapital: 15420,
    totalDistance: 127.5,
    territoriesOwned: 23
  });

  // User location - starts with default, updates with real location
  const [userLocation, setUserLocation] = useState<[number, number]>([17.4326, 78.4071]); // Default: Hyderabad, India
  
  // Get user's actual location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          // Keep default location if geolocation fails
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    }
  }, []);

  const [isActivityActive, setIsActivityActive] = useState(false);
  const [isCompassEnabled, setIsCompassEnabled] = useState(false);
  const [isMiniMapVisible, setIsMiniMapVisible] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [isSocialPanelOpen, setIsSocialPanelOpen] = useState(false);
  
  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  
  // Map ref for recenter functionality
  const mapRef = useRef<any>(null);
  
  // Particle effects state
  const [particleEffect, setParticleEffect] = useState<{
    active: boolean;
    type: 'success' | 'achievement' | 'quest' | 'activity' | 'xp-gain';
    position: { x: number; y: number };
  }>({
    active: false,
    type: 'success',
    position: { x: 50, y: 50 }
  });

  // User Profile Data
  const [userProfile, setUserProfile] = useState({
    id: 'user1',
    username: 'wellness_explorer',
    displayName: 'Wellness Explorer',
    level: 12,
    xp: 8750,
    wellnessCapital: 2450,
    joinDate: new Date('2024-01-15'),
    avatar: {
      character: '🧑‍💼',
      color: '#6366f1',
      accessory: '🎯'
    },
    stats: {
      totalSteps: 145230,
      totalDistance: 87.6,
      totalCalories: 4250,
      totalActiveTime: 2840, // minutes
      questsCompleted: 23,
      territoriesOwned: 7,
      achievementsUnlocked: 15,
      currentStreak: 12,
      longestStreak: 28
    },
    badges: [
      {
        id: 'first_steps',
        name: 'First Steps',
        icon: '👣',
        description: 'Complete your first wellness quest',
        earnedDate: new Date('2024-01-16'),
        rarity: 'common' as const
      },
      {
        id: 'territory_master',
        name: 'Territory Master',
        icon: '🏰',
        description: 'Own 5 territories simultaneously',
        earnedDate: new Date('2024-02-03'),
        rarity: 'rare' as const
      },
      {
        id: 'health_guru',
        name: 'Health Guru',
        icon: '🧘‍♂️',
        description: 'Complete 10 health-related quests',
        earnedDate: new Date('2024-02-15'),
        rarity: 'epic' as const
      },
      {
        id: 'streak_legend',
        name: 'Streak Legend',
        icon: '🔥',
        description: 'Maintain a 21-day activity streak',
        earnedDate: new Date('2024-02-28'),
        rarity: 'legendary' as const
      },
      {
        id: 'explorer',
        name: 'Explorer',
        icon: '🗺️',
        description: 'Discover 15 knowledge orbs',
        earnedDate: new Date('2024-03-05'),
        rarity: 'rare' as const
      },
      {
        id: 'wealth_builder',
        name: 'Wealth Builder',
        icon: '💰',
        description: 'Complete 5 financial literacy quests',
        earnedDate: new Date('2024-03-12'),
        rarity: 'epic' as const
      }
    ],
    milestones: [
      {
        id: 'welcome',
        title: 'Welcome to YouMatter!',
        description: 'Your wellness journey begins here. Start exploring and building healthy habits!',
        date: new Date('2024-01-15'),
        type: 'special' as const
      },
      {
        id: 'first_quest',
        title: 'First Quest Completed',
        description: 'Successfully completed "Hydration Basics" and earned your first XP!',
        date: new Date('2024-01-16'),
        type: 'quest' as const,
        value: 25
      },
      {
        id: 'level_5',
        title: 'Reached Level 5',
        description: 'Your dedication is paying off! New features and quests unlocked.',
        date: new Date('2024-01-28'),
        type: 'level' as const,
        value: 5
      },
      {
        id: 'first_territory',
        title: 'First Territory Captured',
        description: 'Successfully claimed your first wellness territory in the digital realm!',
        date: new Date('2024-02-01'),
        type: 'achievement' as const
      },
      {
        id: 'streak_10',
        title: '10-Day Streak Achieved',
        description: 'Consistency is key! Your wellness habits are becoming stronger.',
        date: new Date('2024-02-11'),
        type: 'streak' as const,
        value: 10
      },
      {
        id: 'level_10',
        title: 'Reached Level 10',
        description: 'Double digits! Advanced wellness challenges and rewards await.',
        date: new Date('2024-03-01'),
        type: 'level' as const,
        value: 10
      },
      {
        id: 'quest_master',
        title: 'Quest Master Achievement',
        description: 'Completed 20 knowledge quests across all categories!',
        date: new Date('2024-03-10'),
        type: 'achievement' as const,
        value: 20
      }
    ]
  });

  // Paper.io style claimed territories
  const [claimedTerritories, setClaimedTerritories] = useState<ClaimedTerritory[]>([]);

  // Knowledge orbs that spawn relative to user location
  const [knowledgeOrbs, setKnowledgeOrbs] = useState<KnowledgeOrb[]>([]);
  
  // Generate orbs around user location when userLocation changes
  useEffect(() => {
    const generateOrbsAroundUser = (centerLat: number, centerLng: number) => {
      const orbs: KnowledgeOrb[] = [
        { 
          id: '1', 
          coordinates: [centerLat + 0.0002, centerLng + 0.0003], // ~30m northeast
          type: 'wealth', 
          title: 'ULIP Myths Quiz', 
          active: true,
          difficulty: 'medium',
          reward: 75,
          description: 'Learn about common ULIP misconceptions and make informed decisions'
        },
        { 
          id: '2', 
          coordinates: [centerLat - 0.0002, centerLng - 0.0001], // ~30m southwest
          type: 'health', 
          title: 'Cardio Benefits', 
          active: true,
          difficulty: 'easy',
          reward: 50,
          description: 'Discover the amazing benefits of cardiovascular exercise'
        },
        { 
          id: '3', 
          coordinates: [centerLat + 0.0006, centerLng + 0.0007], // ~80m northeast
          type: 'insurance', 
          title: 'Policy Basics', 
          active: false,
          difficulty: 'hard',
          reward: 100,
          description: 'Master the fundamentals of insurance policies and coverage'
        },
        { 
          id: '4', 
          coordinates: [centerLat - 0.0003, centerLng + 0.0004], // ~50m northwest
          type: 'health', 
          title: 'Running Technique', 
          active: true,
          difficulty: 'medium',
          reward: 65,
          description: 'Perfect your running form for better performance and injury prevention'
        },
        { 
          id: '5', 
          coordinates: [centerLat + 0.0001, centerLng - 0.0005], // ~50m southeast
          type: 'wealth', 
          title: 'Investment 101', 
          active: true,
          difficulty: 'easy',
          reward: 45,
          description: 'Start your investment journey with these basic principles'
        }
      ];
      return orbs;
    };

    setKnowledgeOrbs(generateOrbsAroundUser(userLocation[0], userLocation[1]));
  }, [userLocation]);

  const [showNotification, setShowNotification] = useState<string | null>(null);

  const handleOrbClick = (orb: KnowledgeOrb) => {
    if (!orb.active) {
      setShowNotification('This knowledge orb is currently inactive!');
      setTimeout(() => setShowNotification(null), 2000);
      return;
    }
    
    // Find a quest based on the orb type
    const availableQuests = QuestManager.getQuestsByType(orb.type);
    const userLevelQuests = availableQuests.filter(quest => quest.prerequisiteLevel <= userStats.level);
    
    if (userLevelQuests.length === 0) {
      setShowNotification(`No ${orb.type} quests available for your level!`);
      setTimeout(() => setShowNotification(null), 2000);
      return;
    }
    
    // Select a random quest from available ones
    const randomQuest = userLevelQuests[Math.floor(Math.random() * userLevelQuests.length)];
    setCurrentQuest(randomQuest);
    setIsQuestModalOpen(true);
  };

  const handleQuestComplete = (questId: string, score: number, earnedPoints: number) => {
    // Trigger particle effect for quest completion
    setParticleEffect({
      active: true,
      type: score >= 80 ? 'achievement' : 'quest',
      position: { x: 50, y: 30 }
    });
    
    // Reset particle effect after animation
    setTimeout(() => {
      setParticleEffect(prev => ({ ...prev, active: false }));
    }, 3000);

    // Add community post for quiz completion
    const quest = QuestManager.getQuestById(questId);
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      userId: userProfile.id,
      username: userProfile.username,
      displayName: userProfile.displayName,
      type: 'quiz_completion',
      content: `Just completed "${quest?.title || 'a quiz'}"! ${score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}`,
      score,
      xpGained: earnedPoints,
      questTitle: quest?.title,
      timestamp: new Date(),
      avatar: userProfile.avatar
    };
    
    setCommunityPosts(prev => [newPost, ...prev]);
    
    setShowNotification(`Quest completed! Score: ${score}% • Earned: +${earnedPoints} XP`);
    setTimeout(() => setShowNotification(null), 4000);
    setIsQuestModalOpen(false);
    setCurrentQuest(null);
  };

  const handleQuestClose = () => {
    setIsQuestModalOpen(false);
    setCurrentQuest(null);
  };

  const handleTerritoryCapture = (territory: ClaimedTerritory) => {
    const reward = calculateTerritoryReward(territory.area);
    setClaimedTerritories(prev => [...prev, territory]);
    
    // Update user profile stats
    setUserProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        territoriesOwned: prev.stats.territoriesOwned + 1
      }
    }));
    
    // Trigger particle effect
    setParticleEffect({
      active: true,
      type: 'achievement',
      position: { x: 50, y: 50 }
    });
    
    setTimeout(() => {
      setParticleEffect(prev => ({ ...prev, active: false }));
    }, 3000);
    
    setShowNotification(`🏆 Territory claimed! +${reward} XP earned • Area: ${territory.area.toFixed(6)} sq units`);
    setTimeout(() => setShowNotification(null), 4000);
  };

  // Navigation handlers
  const handleDirectionsRequest = (destination: [number, number]) => {
    setShowNotification(`Route planned to ${destination[0].toFixed(4)}, ${destination[1].toFixed(4)}`);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleCompassToggle = (enabled: boolean) => {
    setIsCompassEnabled(enabled);
    setShowNotification(enabled ? 'Compass activated!' : 'Compass deactivated');
    setTimeout(() => setShowNotification(null), 1500);
  };

  const handleMiniMapToggle = (enabled: boolean) => {
    setIsMiniMapVisible(enabled);
    setShowNotification(enabled ? 'Mini-map enabled!' : 'Mini-map disabled');
    setTimeout(() => setShowNotification(null), 1500);
  };

  const handleProfileToggle = () => {
    setIsProfilePanelOpen(!isProfilePanelOpen);
  };

  const handleSocialToggle = () => {
    setIsSocialPanelOpen(!isSocialPanelOpen);
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
    setShowNotification('Profile updated successfully!');
    setTimeout(() => setShowNotification(null), 2000);
  };

  const handleNameEditStart = () => {
    setEditedName(userProfile.displayName);
    setIsEditingName(true);
  };

  const handleNameEditSave = () => {
    if (editedName.trim() && editedName !== userProfile.displayName) {
      const updatedProfile = {
        ...userProfile,
        displayName: editedName.trim()
      };
      handleProfileUpdate(updatedProfile);
    }
    setIsEditingName(false);
  };

  const handleNameEditCancel = () => {
    setEditedName('');
    setIsEditingName(false);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameEditSave();
    } else if (e.key === 'Escape') {
      handleNameEditCancel();
    }
  };

  const handleRecenterMap = () => {
    // Actually recenter the map using the ref
    if (mapRef.current) {
      mapRef.current.recenterMap();
      setShowNotification('Map recentered to your location');
    } else {
      setShowNotification('Map recenter not available');
    }
    setTimeout(() => setShowNotification(null), 2000);
  };

  const handleMiniMapLocationClick = (coordinates: [number, number]) => {
    setShowNotification(`Navigating to ${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}`);
    setTimeout(() => setShowNotification(null), 2000);
  };

  const handleActivityMetricsUpdate = (_metrics: any) => {
    // Update any global metrics tracking here
    // For now, just acknowledge the update
  };

  const handleActivityToggle = (active: boolean) => {
    setIsActivityActive(active);
    
    if (active) {
      // Trigger activity start particle effect
      setParticleEffect({
        active: true,
        type: 'activity',
        position: { x: 85, y: 15 }
      });
      
      setTimeout(() => {
        setParticleEffect(prev => ({ ...prev, active: false }));
      }, 2000);
    }
    
    const message = active ? 'Activity tracking started! 🏃‍♂️' : 'Activity tracking stopped';
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 2000);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0a1a0a' }}>
      {/* Top HUD */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #ec4899 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
      }}>
        {/* Logo and Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/logo.png" 
            alt="YouMatter Logo" 
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
          />
          <div>
            <div style={{ 
              color: 'white', 
              fontWeight: 'bold', 
              fontSize: '18px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              YouMatter
            </div>
            <div style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '12px',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
            }}>
              Wellness Realms
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)'
          }}>U</div>
          <div>
            <div style={{ color: 'white', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Level {userStats.level} - 
              {isEditingName ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={handleNameKeyPress}
                  onBlur={handleNameEditSave}
                  autoFocus
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '2px 6px',
                    outline: 'none',
                    width: '120px'
                  }}
                />
              ) : (
                <span
                  onClick={handleNameEditStart}
                  style={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textDecorationStyle: 'dotted',
                    textUnderlineOffset: '2px'
                  }}
                  title="Click to edit name"
                >
                  {userProfile.displayName}
                </span>
              )}
            </div>
            <div style={{
              width: '120px',
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              marginTop: '4px'
            }}>
              <div style={{
                width: `${(userStats.xp % 1000) / 10}%`,
                height: '100%',
                backgroundColor: '#10b981',
                borderRadius: '2px'
              }}></div>
            </div>
          </div>
        </div>

        {/* Stats Display */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#10b981', fontSize: '20px' }}>🗺️</span>
            <span style={{ color: 'white', fontWeight: '600', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>{userStats.territoriesOwned}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#22d3ee', fontSize: '20px' }}>📏</span>
            <span style={{ color: 'white', fontWeight: '600', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>{(userStats.totalDistance / 1000).toFixed(1)}km</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#ec4899', fontSize: '20px' }}>🎯</span>
            <span style={{ color: 'white', fontWeight: '600', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>{userStats.xp} XP</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#f87171', fontSize: '20px' }}>⭐</span>
            <span style={{ color: 'white', fontWeight: '600', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>Lv.{userStats.level}</span>
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '8px 12px',
          borderRadius: '20px',
          border: '1px solid #10b981',
          color: 'white',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        }}>
          {userStats.wellnessCapital.toLocaleString()} WC
        </div>
      </div>

      {/* Real OpenStreetMap */}
      <div style={{ flex: 1, position: 'relative' }}>
        {/* Navigation Controls */}
        <NavigationControls
          userLocation={userLocation}
          onDirectionsRequest={handleDirectionsRequest}
          onCompassToggle={handleCompassToggle}
          onMiniMapToggle={handleMiniMapToggle}
          onProfileToggle={handleProfileToggle}
          onSocialToggle={handleSocialToggle}
          onRecenterMap={handleRecenterMap}
          isCompassEnabled={isCompassEnabled}
          isMiniMapEnabled={isMiniMapVisible}
        />

        {/* Activity Tracker */}
        <ActivityTracker
          isActive={isActivityActive}
          onActivityToggle={handleActivityToggle}
          userLocation={userLocation}
          onMetricsUpdate={handleActivityMetricsUpdate}
        />

        <WellnessMap
          ref={mapRef}
          userLocation={userLocation}
          knowledgeOrbs={knowledgeOrbs}
          onOrbClick={handleOrbClick}
          onTerritoryCapture={handleTerritoryCapture}
          isActivityActive={isActivityActive}
          userStats={userStats}
        />

        {/* Mini Map */}
        <MiniMap
          userLocation={userLocation}
          territories={claimedTerritories.map(t => ({
            id: t.id,
            coordinates: t.center,
            status: 'owned' as const,
            owner: 'user'
          }))}
          knowledgeOrbs={knowledgeOrbs.map(o => ({
            id: o.id,
            coordinates: o.coordinates,
            type: o.type,
            active: o.active
          }))}
          isVisible={isMiniMapVisible}
          onLocationClick={handleMiniMapLocationClick}
        />

        {/* Profile Panel */}
        <ProfilePanel
          isOpen={isProfilePanelOpen}
          onClose={() => setIsProfilePanelOpen(false)}
          userProfile={userProfile}
          onProfileUpdate={handleProfileUpdate}
        />

        {/* Social Panel */}
        <SocialPanel
          isOpen={isSocialPanelOpen}
          onClose={() => setIsSocialPanelOpen(false)}
          currentUserId={userProfile.id}
          communityPosts={communityPosts}
          onAddCommunityPost={(post) => setCommunityPosts(prev => [post, ...prev])}
        />

        {/* Activity Status */}
        {isActivityActive && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(16, 185, 129, 0.9)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '25px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 1000
          }}>
            🏃 Activity in Progress • +25 WC earned
          </div>
        )}

        {/* Notification Toast */}
        {showNotification && (
          <SlideInElement direction="down" className="animate-fadeIn">
            <div style={{
              position: 'absolute',
              top: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(99, 102, 241, 0.9)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '25px',
              fontWeight: '600',
              zIndex: 1000,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              {showNotification}
            </div>
          </SlideInElement>
        )}

        {/* Particle Effects System */}
        <ParticleSystem
          isActive={particleEffect.active}
          type={particleEffect.type}
          position={particleEffect.position}
          intensity={1.5}
        />

        {/* Floating Action Button */}
        <div style={{
          position: 'absolute',
          bottom: '100px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
          transition: 'transform 0.2s ease',
          zIndex: 1000
        }}
        onClick={() => setIsActivityActive(!isActivityActive)}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isActivityActive ? '⏹️' : '▶️'}
        </div>

        {/* Map Controls Info */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          📍 Real GPS Location • 🗺️ OpenStreetMap
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translate(-50%, -20px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

// Simple Community Screen
function CommunityScreen({ communityPosts }: { communityPosts: CommunityPost[] }) {
  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>Community Feed</h1>
      {communityPosts.length === 0 ? (
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          color: '#94a3b8'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌟</div>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No posts yet!</div>
          <div>Complete some quizzes to see your achievements here</div>
        </div>
      ) : (
        communityPosts.map((post) => (
          <div key={post.id} style={{
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                marginRight: '12px'
              }}>
                {post.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{post.displayName}</div>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                  {post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            <div style={{ fontWeight: '500', marginBottom: '8px' }}>{post.content}</div>
            {post.type === 'quiz_completion' && (
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                color: '#10b981', 
                fontSize: '14px', 
                fontWeight: '600' 
              }}>
                <span>📊 Score: {post.score}%</span>
                <span>⭐ +{post.xpGained} XP</span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// Main App Component
function App() {
  const [currentScreen, setCurrentScreen] = useState<'map' | 'community'>('map');
  
  // Community Posts State - moved to main App
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: 'post1',
      userId: 'user2',
      username: 'health_hero',
      displayName: 'Health Hero',
      type: 'quiz_completion',
      content: 'Just aced the "Cardio Fundamentals" quiz! 💪',
      score: 85,
      xpGained: 150,
      questTitle: 'Cardio Fundamentals',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      avatar: {
        character: '🏃‍♀️',
        color: '#10b981',
        accessory: '🏆'
      }
    },
    {
      id: 'post2',
      userId: 'user3',
      username: 'wellness_warrior',
      displayName: 'Wellness Warrior',
      type: 'quiz_completion',
      content: 'Completed "Insurance Basics" quiz! Learning never stops 📚',
      score: 70,
      xpGained: 120,
      questTitle: 'Insurance Basics',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      avatar: {
        character: '🧠',
        color: '#8b5cf6',
        accessory: '📖'
      }
    }
  ]);

  return (
    <Router>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        {currentScreen === 'map' ? 
          <MapScreen communityPosts={communityPosts} setCommunityPosts={setCommunityPosts} /> : 
          <CommunityScreen communityPosts={communityPosts} />
        }
        
        {/* Bottom Navigation */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '12px 0',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1000
        }}>
          <div onClick={() => setCurrentScreen('map')} style={{ 
            cursor: 'pointer', 
            color: currentScreen === 'map' ? '#6366f1' : '#94a3b8',
            fontSize: '24px'
          }}>🗺️</div>
          <div onClick={() => setCurrentScreen('community')} style={{ 
            cursor: 'pointer', 
            color: currentScreen === 'community' ? '#6366f1' : '#94a3b8',
            fontSize: '24px'
          }}>👥</div>
        </div>
      </div>
    </Router>
  );
}

export default App;