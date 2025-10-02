import React, { useState, useEffect } from 'react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'health' | 'wealth' | 'insurance';
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  totalPoints: number;
  timeLimit: number; // in seconds
  badge?: string;
}

interface KnowledgeQuestModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (questId: string, score: number, earnedPoints: number) => void;
  userLevel: number;
}

const KnowledgeQuestModal: React.FC<KnowledgeQuestModalProps> = ({
  quest,
  isOpen,
  onClose,
  onComplete,
  userLevel
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questStarted, setQuestStarted] = useState(false);

  // Reset quest state when modal closes or new quest opens
  useEffect(() => {
    if (!isOpen) {
      setQuestStarted(false);
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setTimeRemaining(0);
      setIsCompleted(false);
      setScore(0);
      setEarnedPoints(0);
      setShowExplanation(false);
    }
  }, [isOpen]);

  // Initialize quest when started - FIXED: Only set timer when quest is actually started
  useEffect(() => {
    if (quest && isOpen && questStarted && timeRemaining === 0) {
      setTimeRemaining(quest.timeLimit);
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setIsCompleted(false);
      setScore(0);
      setEarnedPoints(0);
      setShowExplanation(false);
    }
  }, [quest, isOpen, questStarted]);

  // Timer logic - FIXED: More restrictive conditions to prevent auto-completion
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (questStarted && timeRemaining > 0 && !isCompleted && quest && isOpen) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && questStarted && !isCompleted && quest && isOpen && selectedAnswers.length > 0) {
      // Only auto-complete if the user has made some progress
      handleQuestComplete();
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, questStarted, isCompleted, quest, isOpen, selectedAnswers.length]);

  const startQuest = () => {
    if (quest) {
      setQuestStarted(true);
      setTimeRemaining(quest.timeLimit);
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setIsCompleted(false);
      setScore(0);
      setEarnedPoints(0);
      setShowExplanation(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex < quest!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuestComplete();
    }
  };

  const handleQuestComplete = () => {
    if (!quest) return;
    
    let correctAnswers = 0;
    let totalEarned = 0;
    
    quest.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
        totalEarned += question.points;
      }
    });

    // Bonus points for completion speed and difficulty
    const timeBonus = Math.floor((timeRemaining / quest.timeLimit) * 50);
    const difficultyMultiplier = quest.difficulty === 'hard' ? 2 : quest.difficulty === 'medium' ? 1.5 : 1;
    const levelBonus = Math.floor(userLevel * 5);
    
    totalEarned = Math.floor((totalEarned + timeBonus + levelBonus) * difficultyMultiplier);
    
    const finalScore = Math.floor((correctAnswers / quest.questions.length) * 100);
    
    setScore(finalScore);
    setEarnedPoints(totalEarned);
    setIsCompleted(true);
    
    onComplete(quest.id, finalScore, totalEarned);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'health': return '#10b981';
      case 'wealth': return '#f59e0b';
      case 'insurance': return '#ec4899';
      default: return '#6366f1';
    }
  };

  if (!quest || !isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {!questStarted ? (
          // Quest Preview
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '25px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: getTypeColor(quest.type),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                💡
              </div>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: '24px',
                  color: '#1e293b',
                  marginBottom: '8px'
                }}>
                  {quest.title}
                </h2>
                <div style={{
                  color: '#64748b',
                  fontSize: '16px'
                }}>
                  {quest.description}
                </div>
              </div>
            </div>

            {/* Quest Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
              padding: '20px',
              backgroundColor: '#f8fafc',
              borderRadius: '15px'
            }}>
              <div>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                  Questions
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                  {quest.questions.length}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                  Time Limit
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                  {formatTime(quest.timeLimit)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                  Difficulty
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: getTypeColor(quest.type) }}>
                  {quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                  Your Level
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                  {userLevel}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: '15px 30px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: '#64748b',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ❌ Cancel
              </button>
              <button
                onClick={startQuest}
                style={{
                  padding: '15px 30px',
                  borderRadius: '12px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${getTypeColor(quest.type)} 0%, ${getTypeColor(quest.type)}dd 100%)`,
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🚀 Start Quest
              </button>
            </div>
          </div>
        ) : isCompleted ? (
          // Quest Results
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '20px'
            }}>
              {score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}
            </div>
            <h2 style={{
              margin: 0,
              fontSize: '28px',
              color: '#1e293b',
              marginBottom: '15px'
            }}>
              Quest {score >= 60 ? 'Completed!' : 'Finished!'}
            </h2>
            <div style={{
              fontSize: '20px',
              color: getTypeColor(quest.type),
              fontWeight: 'bold',
              marginBottom: '30px'
            }}>
              Score: {score}% • Earned: +{earnedPoints} XP
            </div>

            {/* Performance Breakdown */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '30px',
              textAlign: 'left'
            }}>
              <h4 style={{ margin: 0, marginBottom: '15px', color: '#1e293b' }}>
                Performance Breakdown
              </h4>
              {quest.questions.map((question, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  <span style={{
                    fontSize: '16px'
                  }}>
                    {selectedAnswers[index] === question.correctAnswer ? '✅' : '❌'}
                  </span>
                  <span style={{ color: '#64748b' }}>
                    Question {index + 1}: {selectedAnswers[index] === question.correctAnswer ? 
                      `+${question.points} XP` : '0 XP'}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              style={{
                padding: '15px 30px',
                borderRadius: '12px',
                border: 'none',
                background: `linear-gradient(135deg, ${getTypeColor(quest.type)} 0%, ${getTypeColor(quest.type)}dd 100%)`,
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🎉 Continue Adventure
            </button>
          </div>
        ) : (
          // Quest Questions
          <div>
            {/* Progress Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  color: '#64748b',
                  marginBottom: '8px'
                }}>
                  Progress: {currentQuestionIndex + 1} / {quest.questions.length}
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${((currentQuestionIndex + 1) / quest.questions.length) * 100}%`,
                    height: '100%',
                    backgroundColor: getTypeColor(quest.type),
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: timeRemaining < 30 ? '#ef4444' : '#1e293b'
              }}>
                ⏱️ {formatTime(timeRemaining)}
              </div>
            </div>

            {/* Current Question */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                color: '#1e293b',
                lineHeight: 1.4,
                marginBottom: '25px'
              }}>
                {quest.questions[currentQuestionIndex].text}
              </h3>

              {/* Answer Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {quest.questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    style={{
                      padding: '15px 20px',
                      borderRadius: '12px',
                      border: selectedAnswers[currentQuestionIndex] === index ? 
                        `2px solid ${getTypeColor(quest.type)}` : '2px solid #e5e7eb',
                      backgroundColor: selectedAnswers[currentQuestionIndex] === index ? 
                        `${getTypeColor(quest.type)}15` : 'white',
                      color: '#1e293b',
                      fontSize: '16px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{
                      display: 'inline-block',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: selectedAnswers[currentQuestionIndex] === index ? 
                        getTypeColor(quest.type) : '#e5e7eb',
                      color: selectedAnswers[currentQuestionIndex] === index ? 'white' : '#64748b',
                      textAlign: 'center',
                      lineHeight: '24px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginRight: '12px'
                    }}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
              <button
                onClick={() => setShowExplanation(true)}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: selectedAnswers[currentQuestionIndex] === undefined ? '#94a3b8' : '#64748b',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: selectedAnswers[currentQuestionIndex] === undefined ? 'not-allowed' : 'pointer'
                }}
              >
                💡 Show Hint
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: selectedAnswers[currentQuestionIndex] === undefined ? '#94a3b8' :
                    `linear-gradient(135deg, ${getTypeColor(quest.type)} 0%, ${getTypeColor(quest.type)}dd 100%)`,
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: selectedAnswers[currentQuestionIndex] === undefined ? 'not-allowed' : 'pointer'
                }}
              >
                {currentQuestionIndex < quest.questions.length - 1 ? '➡️ Next' : '✅ Complete'}
              </button>
            </div>
          </div>
        )}

        {/* Explanation Popup */}
        {showExplanation && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '25px',
              maxWidth: '400px',
              margin: '20px'
            }}>
              <h4 style={{
                margin: 0,
                marginBottom: '15px',
                color: '#1e293b'
              }}>
                💡 Explanation
              </h4>
              <p style={{
                margin: 0,
                marginBottom: '20px',
                color: '#64748b',
                lineHeight: 1.5
              }}>
                {quest.questions[currentQuestionIndex].explanation}
              </p>
              <button
                onClick={() => setShowExplanation(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: getTypeColor(quest.type),
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeQuestModal;