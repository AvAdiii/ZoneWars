// Notifications Screen
const NotificationsScreen = () => {
  return (
    <div className="notifications-screen">
      <h1>🔔 Notifications</h1>
      <div className="notifications-content">
        <div className="notification-item">
          <div className="notification-icon">🏆</div>
          <div className="notification-content">
            <h3>Territory Captured!</h3>
            <p>You've successfully captured Central Park North</p>
            <span className="notification-time">2 hours ago</span>
          </div>
        </div>
        <div className="notification-item">
          <div className="notification-icon">💡</div>
          <div className="notification-content">
            <h3>Knowledge Orb Collected</h3>
            <p>You earned 50 points from a Health Quiz</p>
            <span className="notification-time">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsScreen