# 🌍 Zone Wars: YouMatter Wellness Realms

## 🎯 Overview

Zone Wars is an innovative wellness-focused location-based game that combines the territorial gameplay of Paper.io with educational health, wealth, and insurance content. Players explore their real-world surroundings, claim territories, collect knowledge orbs, and complete interactive quizzes to advance their wellness knowledge and earn rewards.

### 🌟 Key Features

- **📍 Real GPS Integration** - Uses your actual location to create an immersive AR-like experience
- **🗺️ Paper.io Style Gameplay** - Claim territories by walking around and closing loops
- **🧠 Knowledge Quests** - Interactive quizzes covering health, wealth, and insurance topics
- **💎 Knowledge Orbs** - Collectible items scattered around your location that trigger quests
- **📊 Progress Tracking** - Level up system with XP, wellness capital, and achievements
- **👥 Community Features** - Share achievements and compete with other players
- **⚡ Real-time Updates** - Dynamic orb spawning and territory management

## 🎮 How to Play

### 1. **Territory Claiming**
- Walk around in the real world to move your character on the map
- Create closed paths to claim territories (Paper.io style)
- Larger territories provide more rewards and higher scores

### 2. **Knowledge Orbs**
- Blue, green, and purple orbs spawn near your location every 5 seconds
- **Blue Orbs** 💙 - Health & Wellness quests
- **Green Orbs** 💚 - Wealth & Financial literacy
- **Purple Orbs** 💜 - Insurance & Protection knowledge

### 3. **Quests & Learning**
- Click on orbs to start interactive quizzes
- Answer questions within the time limit
- Earn XP and wellness capital based on performance
- Unlock achievements and badges

### 4. **Progression System**
- **Level Up** by earning XP from completed quests
- **Wellness Capital** - In-game currency earned through activities
- **Achievements** - Unlock badges and special rewards
- **Leaderboards** - Compete with the community

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser with geolocation support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AvAdiii/ZoneWars.git
   cd ZoneWars
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` and allow location permissions when prompted.

### Production Build

```bash
npm run build
npm run preview
```


### Styling
- **CSS Modules** - Scoped styling
- **Custom CSS** - Responsive design with mobile-first approach

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── map/             # Map-related components
│   ├── profile/         # User profile and stats
│   ├── social/          # Community features
│   ├── auth/            # Authentication
│   └── common/          # Shared components
├── data/                # Game data and quest content
│   └── questData.ts     # Quiz questions and game content
├── hooks/               # Custom React hooks
├── services/            # API services
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── styles/              # Global styles and themes
```

## 🎯 Game Mechanics

### Quest System
- **554+ Questions** across health, wealth, and insurance topics
- **Difficulty Levels**: Easy, Medium, Hard
- **Time-Limited Challenges** with countdown timers
- **Scoring System** based on accuracy and speed
- **Educational Explanations** for each answer

### Territory System
- **Real-time GPS tracking** for movement
- **Path-based claiming** similar to Paper.io
- **Area calculation** for territory size
- **Visual feedback** with colored boundaries

### Reward System
- **Experience Points (XP)** for quest completion
- **Wellness Capital** as in-game currency
- **Achievement Badges** for milestones
- **Level Progression** with increasing benefits

## 🌍 Features in Detail

### 🗺️ Interactive Map
- **OpenStreetMap Integration** for accurate real-world representation
- **Real GPS Location** tracking and updates
- **Dynamic Orb Spawning** around user location
- **Territory Visualization** with smooth animations
- **Mini-map Overview** for better navigation


### 🎨 User Experience
- **Smooth Animations** with Framer Motion
- **Particle Effects** for achievements and interactions
- **Real-time Notifications** for events and updates
- **Accessibility Features** for inclusive gameplay


### Map Configuration
The application uses OpenStreetMap by default. You can configure different tile providers in the map components.

## 🐛 Known Issues & Roadmap

### Current Known Issues
- Geolocation may be inaccurate indoors
- Territory claiming requires stable GPS signal
- Some features require internet connectivity

### Upcoming Features
- [ ] Multiplayer real-time battles
- [ ] Advanced achievement system
- [ ] Social features and friend systems
- [ ] Custom quest creation tools
- [ ] AR camera integration
- [ ] Offline mode improvements

  <p>Made with ❤️ for wellness and learning</p>
  <p>© 2024 YouMatter Wellness Realms. All rights reserved.</p>
</div>
