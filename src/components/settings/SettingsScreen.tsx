// Settings Screen
const SettingsScreen = () => {
  return (
    <div className="settings-screen">
      <h1>⚙️ Settings</h1>
      <div className="settings-content">
        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="setting-item">
            <label>Push Notifications</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <label>Sound</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
        <div className="settings-section">
          <h2>Privacy</h2>
          <div className="setting-item">
            <label>Location Sharing</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <label>Activity Tracking</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
        <div className="settings-section">
          <h2>Account</h2>
          <button className="settings-btn">Sign Out</button>
        </div>
      </div>
    </div>
  )
}

export default SettingsScreen