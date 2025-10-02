// Activity Screen - shows session tracking and history
const ActivityScreen = () => {
  return (
    <div className="activity-screen">
      <h1>Activity Tracking</h1>
      <div className="activity-content">
        <div className="current-session">
          <h2>Current Session</h2>
          <p>Start tracking your wellness activities</p>
          <button>Start Activity</button>
        </div>
        <div className="activity-history">
          <h2>Activity History</h2>
          <p>Your recent wellness activities will appear here</p>
        </div>
      </div>
    </div>
  )
}

export default ActivityScreen