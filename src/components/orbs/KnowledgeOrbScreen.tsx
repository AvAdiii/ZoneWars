// Knowledge Orb Screen - quiz interaction
const KnowledgeOrbScreen = () => {
  return (
    <div className="knowledge-orb-screen">
      <div className="orb-header">
        <h1>💡 Knowledge Orb</h1>
        <div className="orb-category">Health & Wellness</div>
      </div>
      <div className="quiz-content">
        <div className="question">
          <h2>Which of these is best for cardiovascular health?</h2>
        </div>
        <div className="options">
          <button className="option">A. Regular aerobic exercise</button>
          <button className="option">B. High sodium diet</button>
          <button className="option">C. Sedentary lifestyle</button>
          <button className="option">D. Smoking</button>
        </div>
        <div className="quiz-actions">
          <button className="submit-btn">Start Quiz</button>
          <div className="quiz-points">Earn XP by completing!</div>
        </div>
      </div>
    </div>
  )
}

export default KnowledgeOrbScreen