import React, { useState } from 'react';

interface Friend {
  id: string;
  username: string;
  displayName: string;
  level: number;
  avatar: {
    character: string;
    color: string;
    accessory: string;
  };
  status: 'online' | 'offline' | 'in-activity';
  lastSeen: Date;
  weeklyScore: number;
  totalSteps: number;
  streak: number;
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

interface LeaderboardEntry {
  id: string;
  username: string;
  displayName: string;
  avatar: {
    character: string;
    color: string;
    accessory: string;
  };
  score: number;
  rank: number;
  level: number;
  change: number; // rank change from last week
}

interface TeamChallenge {
  id: string;
  name: string;
  description: string;
  type: 'steps' | 'quests' | 'territories' | 'mixed';
  startDate: Date;
  endDate: Date;
  participants: string[];
  maxParticipants: number;
  reward: {
    xp: number;
    wellnessCapital: number;
    badge?: string;
  };
  progress: {
    current: number;
    target: number;
  };
  status: 'upcoming' | 'active' | 'completed';
}

interface SocialPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  communityPosts?: CommunityPost[];
  onAddCommunityPost?: (post: CommunityPost) => void;
}

const SocialPanel: React.FC<SocialPanelProps> = ({
  isOpen,
  onClose,
  currentUserId,
  communityPosts = [],
  onAddCommunityPost
}) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'leaderboard' | 'challenges' | 'teams' | 'community'>('community');
  const [notification, setNotification] = useState<string | null>(null);

  // Mock data - in real app, this would come from backend
  const [friends] = useState<Friend[]>([
    {
      id: 'friend1',
      username: 'health_ninja',
      displayName: 'Health Ninja',
      level: 15,
      avatar: { character: '👩‍⚕️', color: '#10b981', accessory: '⚡' },
      status: 'online',
      lastSeen: new Date(),
      weeklyScore: 2850,
      totalSteps: 89243,
      streak: 18
    },
    {
      id: 'friend2',
      username: 'wellness_guru',
      displayName: 'Wellness Guru',
      level: 22,
      avatar: { character: '🧘‍♂️', color: '#8b5cf6', accessory: '🔥' },
      status: 'in-activity',
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      weeklyScore: 3240,
      totalSteps: 156789,
      streak: 31
    },
    {
      id: 'friend3',
      username: 'step_master',
      displayName: 'Step Master',
      level: 8,
      avatar: { character: '🏃‍♂️', color: '#0ea5e9', accessory: '👑' },
      status: 'offline',
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      weeklyScore: 1980,
      totalSteps: 45678,
      streak: 7
    },
    {
      id: 'friend4',
      username: 'fit_explorer',
      displayName: 'Fit Explorer',
      level: 18,
      avatar: { character: '🧑‍🚀', color: '#f59e0b', accessory: '🎯' },
      status: 'online',
      lastSeen: new Date(),
      weeklyScore: 2650,
      totalSteps: 98432,
      streak: 14
    }
  ]);

  const [leaderboard] = useState<LeaderboardEntry[]>([
    {
      id: 'leader1',
      username: 'wellness_champion',
      displayName: 'Wellness Champion',
      avatar: { character: '👑', color: '#f59e0b', accessory: '✨' },
      score: 4520,
      rank: 1,
      level: 28,
      change: 2
    },
    {
      id: 'leader2',
      username: 'fitness_king',
      displayName: 'Fitness King',
      avatar: { character: '🦾', color: '#ef4444', accessory: '🔥' },
      score: 4180,
      rank: 2,
      level: 25,
      change: -1
    },
    {
      id: 'leader3',
      username: 'health_queen',
      displayName: 'Health Queen',
      avatar: { character: '👸', color: '#8b5cf6', accessory: '💎' },
      score: 3890,
      rank: 3,
      level: 24,
      change: 1
    },
    {
      id: currentUserId,
      username: 'wellness_explorer',
      displayName: 'Wellness Explorer',
      avatar: { character: '🧑‍💼', color: '#6366f1', accessory: '🎯' },
      score: 3250,
      rank: 8,
      level: 12,
      change: 3
    }
  ]);

  const [teamChallenges] = useState<TeamChallenge[]>([
    {
      id: 'challenge1',
      name: '10K Steps Marathon',
      description: 'Team up to reach 100,000 combined steps this week!',
      type: 'steps',
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      participants: ['user1', 'friend1', 'friend2'],
      maxParticipants: 5,
      reward: { xp: 500, wellnessCapital: 1000, badge: 'Team Walker' },
      progress: { current: 67500, target: 100000 },
      status: 'active'
    },
    {
      id: 'challenge2',
      name: 'Knowledge Quest Sprint',
      description: 'Complete 25 knowledge quests as a team within 3 days!',
      type: 'quests',
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      participants: [],
      maxParticipants: 4,
      reward: { xp: 750, wellnessCapital: 1500, badge: 'Quiz Masters' },
      progress: { current: 0, target: 25 },
      status: 'upcoming'
    },
    {
      id: 'challenge3',
      name: 'Territory Conquest',
      description: 'Claim and defend 20 territories as a unified team!',
      type: 'territories',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      participants: ['user1', 'friend3', 'friend4'],
      maxParticipants: 3,
      reward: { xp: 600, wellnessCapital: 800 },
      progress: { current: 20, target: 20 },
      status: 'completed'
    }
  ]);

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'in-activity': return '#f59e0b';
      case 'offline': return '#64748b';
      default: return '#64748b';
    }
  };

  const getStatusText = (status: Friend['status'], lastSeen: Date) => {
    switch (status) {
      case 'online': return 'Online';
      case 'in-activity': return 'In Activity';
      case 'offline': {
        const hoursAgo = Math.floor((Date.now() - lastSeen.getTime()) / (60 * 60 * 1000));
        return `${hoursAgo}h ago`;
      }
      default: return 'Unknown';
    }
  };

  const getRankChange = (change: number) => {
    if (change > 0) return { icon: '↗️', color: '#10b981', text: `+${change}` };
    if (change < 0) return { icon: '↘️', color: '#ef4444', text: `${change}` };
    return { icon: '➡️', color: '#64748b', text: '0' };
  };

  const getChallengeStatusColor = (status: TeamChallenge['status']) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'upcoming': return '#f59e0b';
      case 'completed': return '#6366f1';
      default: return '#64748b';
    }
  };

  const handleSendChallenge = (friendId: string) => {
    setNotification(`Challenge sent to ${friends.find(f => f.id === friendId)?.displayName}!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleJoinChallenge = (challengeId: string) => {
    setNotification(`Joined team challenge: ${teamChallenges.find(c => c.id === challengeId)?.name}!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const formatTimeRemaining = (endDate: Date) => {
    const remaining = endDate.getTime() - Date.now();
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
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
        maxWidth: '900px',
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
          <div>
            <h2 style={{ margin: 0, fontSize: '24px' }}>
              🤝 Social Hub
            </h2>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Connect, compete, and grow together
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
            { id: 'community', label: 'Community', icon: '📢' },
            { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
            { id: 'friends', label: 'Friends', icon: '👥' },
            { id: 'challenges', label: 'Challenges', icon: '⚔️' },
            { id: 'teams', label: 'Teams', icon: '🛡️' }
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
          {/* Community Tab */}
          {activeTab === 'community' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#1e293b' }}>
                📢 Community Feed
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {communityPosts.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#64748b',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎯</div>
                    <p>No community posts yet!</p>
                    <p>Complete quizzes and challenges to share your achievements!</p>
                  </div>
                ) : (
                  communityPosts.map(post => (
                    <div key={post.id} style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '15px',
                      padding: '20px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: post.avatar.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px'
                        }}>
                          {post.avatar.character}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '16px' }}>
                            {post.displayName}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '14px' }}>
                            {new Date(post.timestamp).toLocaleString()}
                          </div>
                        </div>
                        {post.type === 'quiz_completion' && (
                          <div style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            Quiz Complete
                          </div>
                        )}
                      </div>
                      
                      <div style={{ marginBottom: '15px', color: '#374151', lineHeight: 1.5 }}>
                        {post.content}
                      </div>
                      
                      {post.type === 'quiz_completion' && post.score !== undefined && post.xpGained !== undefined && (
                        <div style={{
                          backgroundColor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '10px',
                          padding: '12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{ display: 'flex', gap: '20px' }}>
                            <div>
                              <span style={{ color: '#64748b', fontSize: '14px' }}>Score: </span>
                              <span style={{ color: '#10b981', fontWeight: 'bold' }}>{post.score}%</span>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', fontSize: '14px' }}>XP Gained: </span>
                              <span style={{ color: '#10b981', fontWeight: 'bold' }}>+{post.xpGained}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: '20px' }}>
                            {post.score >= 80 ? '🎉' : post.score >= 60 ? '👍' : '📚'}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#1e293b' }}>
                🏆 Weekly Leaderboard
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                {leaderboard.map((entry, _index) => {
                  const rankChange = getRankChange(entry.change);
                  const isCurrentUser = entry.id === currentUserId;
                  
                  return (
                    <div
                      key={entry.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '15px 20px',
                        marginBottom: '10px',
                        backgroundColor: isCurrentUser ? '#6366f115' : '#f8fafc',
                        borderRadius: '12px',
                        border: isCurrentUser ? '2px solid #6366f1' : '1px solid #e5e7eb'
                      }}
                    >
                      {/* Rank */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: entry.rank <= 3 ? '#f59e0b' : '#6366f1',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        marginRight: '15px'
                      }}>
                        {entry.rank <= 3 ? ['👑', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                      </div>

                      {/* Avatar */}
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: entry.avatar.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        marginRight: '15px',
                        position: 'relative'
                      }}>
                        {entry.avatar.character}
                        <div style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          fontSize: '12px'
                        }}>
                          {entry.avatar.accessory}
                        </div>
                      </div>

                      {/* User Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#1e293b',
                          marginBottom: '4px'
                        }}>
                          {entry.displayName} {isCurrentUser && '(You)'}
                        </div>
                        <div style={{ fontSize: '14px', color: '#64748b' }}>
                          Level {entry.level} • {entry.score.toLocaleString()} WC
                        </div>
                      </div>

                      {/* Rank Change */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: rankChange.color,
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {rankChange.icon} {rankChange.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#1e293b' }}>
                👥 Friends ({friends.length})
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                {friends.map(friend => (
                  <div
                    key={friend.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '15px 20px',
                      marginBottom: '10px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: friend.avatar.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      marginRight: '15px',
                      position: 'relative'
                    }}>
                      {friend.avatar.character}
                      <div style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        fontSize: '12px'
                      }}>
                        {friend.avatar.accessory}
                      </div>
                      {/* Status indicator */}
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(friend.status),
                        border: '2px solid white'
                      }}></div>
                    </div>

                    {/* Friend Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#1e293b',
                        marginBottom: '4px'
                      }}>
                        {friend.displayName}
                      </div>
                      <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                        Level {friend.level} • {getStatusText(friend.status, friend.lastSeen)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {friend.totalSteps.toLocaleString()} steps • {friend.streak} day streak
                      </div>
                    </div>

                    {/* Weekly Score */}
                    <div style={{
                      textAlign: 'right',
                      marginRight: '15px'
                    }}>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#6366f1'
                      }}>
                        {friend.weeklyScore}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Weekly WC
                      </div>
                    </div>

                    {/* Challenge Button */}
                    <button
                      onClick={() => handleSendChallenge(friend.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      ⚔️ Challenge
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#1e293b' }}>
                ⚔️ Team Challenges
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                {teamChallenges.map(challenge => (
                  <div
                    key={challenge.id}
                    style={{
                      padding: '20px',
                      marginBottom: '15px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: `2px solid ${getChallengeStatusColor(challenge.status)}20`
                    }}
                  >
                    {/* Challenge Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '15px'
                    }}>
                      <div>
                        <h4 style={{
                          margin: 0,
                          fontSize: '18px',
                          color: '#1e293b',
                          marginBottom: '5px'
                        }}>
                          {challenge.name}
                        </h4>
                        <div style={{
                          fontSize: '14px',
                          color: '#64748b'
                        }}>
                          {challenge.description}
                        </div>
                      </div>
                      <div style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        backgroundColor: getChallengeStatusColor(challenge.status),
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {challenge.status}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {challenge.status === 'active' && (
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                          fontSize: '14px'
                        }}>
                          <span style={{ color: '#64748b' }}>Progress</span>
                          <span style={{ fontWeight: 'bold' }}>
                            {challenge.progress.current.toLocaleString()} / {challenge.progress.target.toLocaleString()}
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
                            width: `${(challenge.progress.current / challenge.progress.target) * 100}%`,
                            height: '100%',
                            backgroundColor: getChallengeStatusColor(challenge.status),
                            borderRadius: '4px',
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                      </div>
                    )}

                    {/* Challenge Details */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
                        <div>
                          <span style={{ color: '#64748b' }}>Participants:</span>
                          <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                            {challenge.participants.length}/{challenge.maxParticipants}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Reward:</span>
                          <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                            {challenge.reward.xp} XP, {challenge.reward.wellnessCapital} WC
                          </span>
                        </div>
                        {challenge.status === 'active' && (
                          <div>
                            <span style={{ color: '#64748b' }}>Time left:</span>
                            <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                              {formatTimeRemaining(challenge.endDate)}
                            </span>
                          </div>
                        )}
                      </div>

                      {challenge.status === 'upcoming' && !challenge.participants.includes(currentUserId) && (
                        <button
                          onClick={() => handleJoinChallenge(challenge.id)}
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
                          🚀 Join Challenge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teams Tab */}
          {activeTab === 'teams' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#1e293b' }}>
                🛡️ Your Teams
              </h3>
              
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#64748b'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🛡️</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                  No teams yet!
                </div>
                <div style={{ fontSize: '14px', marginBottom: '20px' }}>
                  Create or join a team to collaborate on wellness goals
                </div>
                <button
                  style={{
                    padding: '12px 24px',
                    borderRadius: '25px',
                    border: 'none',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                  onClick={() => setNotification('Team creation feature coming soon!')}
                >
                  ➕ Create Team
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notification */}
        {notification && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(16, 185, 129, 0.9)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '25px',
            fontWeight: '600',
            zIndex: 3000
          }}>
            {notification}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialPanel;