import './LoadingScreen.css'

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo">
          <h1>YouMatter</h1>
          <p>Wellness Realms</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loading-text">Initializing your wellness journey...</p>
      </div>
    </div>
  )
}

export default LoadingScreen