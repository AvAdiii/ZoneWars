import React, { useState } from 'react';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  level: number;
  xp: number;
  wellnessCapital: number;
  joinDate: Date;
  avatar: {
    character: string;
    color: string;
    accessory: string;
  };
  stats: {
    totalSteps: number;
    totalDistance: number;
    totalCalories: number;
    totalActiveTime: number;
    questsCompleted: number;
    territoriesOwned: number;
    achievementsUnlocked: number;
    currentStreak: number;
    longestStreak: number;
  };
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    earnedDate: Date;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    date: Date;
    type: 'achievement' | 'quest' | 'level' | 'streak' | 'special';
    value?: number;
  }>;
}

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  isOpen,
  onClose,
  userProfile,
  onProfileUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'customize' | 'achievements' | 'timeline'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const avatarCharacters = ['🧑‍💼', '👩‍⚕️', '🧑‍🏫', '👨‍💻', '👩‍🎨', '🧑‍🚀', '👨‍🍳', '👩‍🔬'];
  const avatarColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9', '#84cc16', '#f97316'];
  const avatarAccessories = ['🎩', '👑', '🎯', '🏆', '💎', '⭐', '🔥', '🚀'];

  const getXPToNextLevel = (level: number) => {
    return level * 1000; // Simple formula: level * 1000 XP
  };

  const getLevelProgress = () => {
    const currentLevelXP = (userProfile.level - 1) * 1000;
    const nextLevelXP = userProfile.level * 1000;
    const progressXP = userProfile.xp - currentLevelXP;
    const totalXPNeeded = nextLevelXP - currentLevelXP;
    return (progressXP / totalXPNeeded) * 100;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#64748b';
      case 'rare': return '#10b981';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'quest': return '📚';
      case 'level': return '⬆️';
      case 'streak': return '🔥';
      case 'special': return '✨';
      default: return '📅';
    }
  };

  const handleSaveProfile = () => {
    onProfileUpdate(editedProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '800px',
        height: '90%',
        maxHeight: '700px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '25px 30px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: userProfile.avatar.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              border: '3px solid white',
              position: 'relative'
            }}>
              {userProfile.avatar.character}
              <div style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                fontSize: '16px'
              }}>
                {userProfile.avatar.accessory}
              </div>
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px' }}>
                {userProfile.displayName}
              </h2>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                Level {userProfile.level} • {userProfile.wellnessCapital.toLocaleString()} WC
              </div>
              <div style={{
                width: '200px',
                height: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '3px',
                marginTop: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${getLevelProgress()}%`,
                  height: '100%',
                  backgroundColor: 'white',
                  borderRadius: '3px',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
              <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
                {userProfile.xp} / {getXPToNextLevel(userProfile.level)} XP
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'customize', label: 'Customize', icon: '🎨' },
            { id: 'achievements', label: 'Achievements', icon: '🏆' },
            { id: 'timeline', label: 'Journey', icon: '📈' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '15px 20px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? '#6366f1' : '#64748b',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                borderBottom: activeTab === tab.id ? '2px solid #6366f1' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '25px 30px'
        }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#1e293b' }}>
                📊 Wellness Statistics
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                {[
                  { label: 'Total Steps', value: userProfile.stats.totalSteps.toLocaleString(), icon: '👣', color: '#10b981' },
                  { label: 'Distance Covered', value: `${userProfile.stats.totalDistance.toFixed(1)} km`, icon: '🏃‍♂️', color: '#0ea5e9' },
                  { label: 'Calories Burned', value: userProfile.stats.totalCalories.toLocaleString(), icon: '🔥', color: '#f59e0b' },
                  { label: 'Active Time', value: `${Math.floor(userProfile.stats.totalActiveTime / 60)}h ${userProfile.stats.totalActiveTime % 60}m`, icon: '⏱️', color: '#8b5cf6' },
                  { label: 'Quests Completed', value: userProfile.stats.questsCompleted.toString(), icon: '📚', color: '#6366f1' },
                  { label: 'Territories Owned', value: userProfile.stats.territoriesOwned.toString(), icon: '🏰', color: '#ef4444' }
                ].map((stat, index) => (
                  <div key={index} style={{
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: `2px solid ${stat.color}20`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      {stat.icon}
                    </div>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: stat.color,
                      marginBottom: '4px'
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Streak Information */}
              <div style={{
                padding: '20px',
                backgroundColor: '#fef3c7',
                borderRadius: '12px',
                border: '2px solid #f59e0b',
                marginBottom: '20px'
              }}>
                <h4 style={{ margin: 0, marginBottom: '15px', color: '#92400e' }}>
                  🔥 Streak Information
                </h4>
                <div style={{ display: 'flex', gap: '30px' }}>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
                      {userProfile.stats.currentStreak}
                    </div>
                    <div style={{ fontSize: '14px', color: '#92400e' }}>
                      Current Streak (days)
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
                      {userProfile.stats.longestStreak}
                    </div>
                    <div style={{ fontSize: '14px', color: '#92400e' }}>
                      Longest Streak (days)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customize Tab */}
          {activeTab === 'customize' && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '25px'
              }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>
                  🎨 Customize Avatar
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#6366f1',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    ✏️ Edit
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        backgroundColor: 'white',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#10b981',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      💾 Save
                    </button>
                  </div>
                )}
              </div>

              {/* Avatar Preview */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '30px'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: isEditing ? editedProfile.avatar.color : userProfile.avatar.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '60px',
                  border: '4px solid #e5e7eb',
                  position: 'relative'
                }}>
                  {isEditing ? editedProfile.avatar.character : userProfile.avatar.character}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    fontSize: '30px'
                  }}>
                    {isEditing ? editedProfile.avatar.accessory : userProfile.avatar.accessory}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div>
                  {/* Character Selection */}
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ marginBottom: '15px', color: '#1e293b' }}>
                      👤 Character
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '12px'
                    }}>
                      {avatarCharacters.map(character => (
                        <button
                          key={character}
                          onClick={() => setEditedProfile(prev => ({
                            ...prev,
                            avatar: { ...prev.avatar, character }
                          }))}
                          style={{
                            padding: '15px',
                            borderRadius: '12px',
                            border: editedProfile.avatar.character === character ? 
                              '3px solid #6366f1' : '2px solid #e5e7eb',
                            backgroundColor: editedProfile.avatar.character === character ? 
                              '#6366f115' : 'white',
                            fontSize: '30px',
                            cursor: 'pointer'
                          }}
                        >
                          {character}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ marginBottom: '15px', color: '#1e293b' }}>
                      🎨 Background Color
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '12px'
                    }}>
                      {avatarColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setEditedProfile(prev => ({
                            ...prev,
                            avatar: { ...prev.avatar, color }
                          }))}
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            border: editedProfile.avatar.color === color ? 
                              '4px solid #1e293b' : '2px solid #e5e7eb',
                            backgroundColor: color,
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Accessory Selection */}
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ marginBottom: '15px', color: '#1e293b' }}>
                      ✨ Accessory
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '12px'
                    }}>
                      {avatarAccessories.map(accessory => (
                        <button
                          key={accessory}
                          onClick={() => setEditedProfile(prev => ({
                            ...prev,
                            avatar: { ...prev.avatar, accessory }
                          }))}
                          style={{
                            padding: '15px',
                            borderRadius: '12px',
                            border: editedProfile.avatar.accessory === accessory ? 
                              '3px solid #6366f1' : '2px solid #e5e7eb',
                            backgroundColor: editedProfile.avatar.accessory === accessory ? 
                              '#6366f115' : 'white',
                            fontSize: '30px',
                            cursor: 'pointer'
                          }}
                        >
                          {accessory}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#1e293b' }}>
                🏆 Achievement Gallery
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '15px'
              }}>
                {userProfile.badges.map(badge => (
                  <div
                    key={badge.id}
                    style={{
                      padding: '20px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: `2px solid ${getRarityColor(badge.rarity)}`,
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: getRarityColor(badge.rarity),
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {badge.rarity}
                    </div>
                    
                    <div style={{
                      fontSize: '40px',
                      textAlign: 'center',
                      marginBottom: '10px'
                    }}>
                      {badge.icon}
                    </div>
                    
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '5px',
                      textAlign: 'center'
                    }}>
                      {badge.name}
                    </div>
                    
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b',
                      textAlign: 'center',
                      marginBottom: '10px'
                    }}>
                      {badge.description}
                    </div>
                    
                    <div style={{
                      fontSize: '11px',
                      color: getRarityColor(badge.rarity),
                      textAlign: 'center'
                    }}>
                      Earned: {badge.earnedDate.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#1e293b' }}>
                📈 Wellness Journey
              </h3>
              
              <div style={{ position: 'relative' }}>
                {/* Timeline Line */}
                <div style={{
                  position: 'absolute',
                  left: '20px',
                  top: '0',
                  bottom: '0',
                  width: '2px',
                  backgroundColor: '#e5e7eb'
                }}></div>
                
                {userProfile.milestones.map((milestone, _index) => (
                  <div
                    key={milestone.id}
                    style={{
                      position: 'relative',
                      marginBottom: '25px',
                      paddingLeft: '60px'
                    }}
                  >
                    {/* Timeline Dot */}
                    <div style={{
                      position: 'absolute',
                      left: '10px',
                      top: '5px',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: '#6366f1',
                      border: '3px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px'
                    }}>
                      {getMilestoneIcon(milestone.type)}
                    </div>
                    
                    {/* Milestone Content */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '15px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#1e293b'
                        }}>
                          {milestone.title}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#64748b'
                        }}>
                          {milestone.date.toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div style={{
                        fontSize: '14px',
                        color: '#64748b',
                        lineHeight: 1.5
                      }}>
                        {milestone.description}
                        {milestone.value && (
                          <span style={{ fontWeight: 'bold', color: '#6366f1' }}>
                            {' '}{milestone.value}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;