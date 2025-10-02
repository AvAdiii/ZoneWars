// Achievements Screen
const AchievementsScreen = () => {
  return (
    <div className="achievements-screen">
      <h1>🏆 Achievements</h1>
      <div className="achievements-content">
        <div className="achievement-categories">
          <button className="category-btn active">All</button>
          <button className="category-btn">Distance</button>
          <button className="category-btn">Territory</button>
          <button className="category-btn">Knowledge</button>
          <button className="category-btn">Social</button>
        </div>
        <div className="achievements-grid">
          <div className="achievement-card unlocked">
            <div className="achievement-icon">🚶</div>
            <h3>First Steps</h3>
            <p>Complete your first activity</p>
            <div className="achievement-points">+50 pts</div>
          </div>
          <div className="achievement-card locked">
            <div className="achievement-icon">🏃</div>
            <h3>Marathon Runner</h3>
            <p>Walk 42km in total</p>
            <div className="achievement-progress">5.2 / 42 km</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AchievementsScreen