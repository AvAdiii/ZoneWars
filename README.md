# YouMatter - Wellness & Territory Conquest App

A modern wellness application that combines health tracking with an engaging real-world territory conquest game. Built with React, Tailwind CSS, and Leaflet.js.

## 🚀 Features

### 1. Main Dashboard (`dashboard.html`)
- **Wellness Metrics Tracking**: Daily steps, financial wellness, mindfulness, and sleep quality
- **Geo-Conquest Preview**: Eye-catching card promoting the main game feature
- **Daily Challenges**: Gamified quests with progress tracking
- **Points & Level System**: User progression with wellness points
- **Responsive Design**: Mobile-first design with calming color palette

### 2. Geo-Conquest Game (`geo-conquest.html`)
- **Real-time GPS Tracking**: Live location monitoring and path drawing
- **Territory Capture**: Paper.io-style territory claiming mechanics
- **Multiplayer Features**: See other players' territories in real-time
- **Territory Takeover**: Capture opponents' territories by enclosing them
- **Interactive Map**: Full-screen Leaflet.js map with custom styling
- **Statistics Display**: Current area, total territory, and global rank

### 3. Community Hub (`community.html`)
- **Leaderboards**: Global, local, and friends rankings
- **Community Challenges**: Competitive and collaborative events
- **User Profiles**: Public profiles with achievements and statistics
- **Social Features**: Friend system and player discovery

## 🎨 Design System

- **Color Palette**:
  - Calm Blue: `#3B82F6` - Primary brand color
  - Vibrant Green: `#10B981` - Success and progress
  - Encouraging Orange: `#F59E0B` - Rewards and highlights
- **Typography**: Modern, readable fonts with clear hierarchy
- **Components**: Reusable cards, buttons, and navigation elements

## 🛠️ Technical Stack

- **Frontend**: React.js, HTML5, CSS3
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js with CartoDB Positron tiles
- **Geospatial**: Turf.js for geometric calculations
- **Backend**: Firebase/Firestore (mock implementation included)

## 📱 Getting Started

1. **Open the App**: Start with `index.html` for navigation between components
2. **Allow Location**: Grant location permissions for GPS features
3. **Explore Components**:
   - Dashboard: Overview of wellness metrics and challenges
   - Geo-Conquest: Interactive map game
   - Community: Social features and leaderboards

## 🎯 Core Mechanics

### Territory Capture
1. Start GPS tracking in the Geo-Conquest game
2. Walk to create a path on the map
3. Close loops by returning to your starting point
4. Automatically capture enclosed areas as territory
5. Take over opponents' territories by enclosing them

### Wellness Integration
- Daily step tracking contributes to challenges
- Financial wellness goals with progress tracking
- Mindfulness sessions and sleep quality monitoring
- Gamified rewards system with points and levels

### Social Features
- Real-time leaderboards with global and local rankings
- Community challenges with collective goals
- User profiles with achievements and territory displays
- Friend system for enhanced competition

## 🔧 Development Notes

### Firebase Setup
Currently uses mock data for demonstration. To integrate with actual Firebase:

1. Replace mock Firebase implementation in `geo-conquest.html`
2. Add Firebase SDK and configuration
3. Set up Firestore collections for territories and users
4. Implement user authentication

### GPS Requirements
- Requires HTTPS for production deployment
- Location permissions must be granted by users
- High accuracy GPS for best territory capture experience

### Mobile Optimization
- Responsive design works on all screen sizes
- Touch-friendly interface elements
- Optimized for mobile GPS usage

## 📊 Features Implementation Status

✅ **Completed**:
- Main dashboard with wellness metrics
- Interactive map with GPS tracking
- Territory capture mechanics
- Community leaderboards and challenges
- User profiles and social features
- Responsive design and mobile optimization

🔄 **For Production**:
- Real Firebase integration
- User authentication system
- Push notifications for challenges
- Offline functionality
- App store deployment

## 🎮 How to Play Geo-Conquest

1. **Start Tracking**: Tap "Start Tracking" in the game interface
2. **Walk Around**: Move in real-world to create paths on the map
3. **Capture Territory**: Create closed loops to claim areas
4. **Strategic Play**: Enclose opponents' territories to take them over
5. **Compete**: Climb leaderboards and complete challenges

## 🌟 Wellness Focus Areas

Based on the StarHack problem statement, the app addresses:
- **Physical Health**: Step tracking and movement incentives
- **Financial Wellness**: Savings goals and financial literacy
- **Mental Health**: Mindfulness sessions and stress reduction
- **Social Connection**: Community challenges and friend interactions
- **Gamification**: Points, levels, and achievement systems

## 📝 License

This project is created as a demonstration for the StarHack competition. All rights reserved.