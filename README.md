# PayBack - Loan Tracker MVP

A modern, mobile-optimized loan tracking application built with React, TypeScript, and Material UI. Track money you've lent to friends with an organized, visual interface.

## 🌟 Features

### Core Features
- **📱 Multi-Platform**: Deploy as Web App, iOS App, or Android App from single codebase
- **👥 Contact Integration**: Select friends from your phone's contact list (mobile) or enter manually
- **💰 Loan Management**: Track loans with amount, dates, notes, and receipt attachments
- **📊 Visual Dashboard**: See total outstanding amounts and per-person balances at a glance
- **💳 Detailed Views**: View comprehensive loan details and full repayment history
- **🔍 Search & Filter**: Quickly find contacts and their loans
- **💵 Currency Support**: MVR currency formatting throughout the app
- **🌓 Dark Mode**: Automatic light/dark theme based on system preferences
- **📲 Offline-First**: All data stored locally, works completely offline

### Technical Features
- **🏗️ Single Codebase**: React + TypeScript shared across web, iOS, Android
- **⚡ Fast & Responsive**: Vite-powered development with HMR
- **📦 Capacitor Integration**: Native APIs on mobile (camera, contacts, storage)
- **💾 Platform-Specific Storage**: IndexedDB on web, SQLite ready for mobile
- **🎨 Material Design 3**: Beautiful UI with MUI v6
- **🧠 Smart State Management**: Zustand for efficient state handling
- **🔐 Type Safe**: Full TypeScript implementation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Web Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:5173

# Build for production
npm run build:web
```

### Mobile Development

**iOS (macOS only):**
```bash
npm run ios:dev  # Opens Xcode
```

**Android:**
```bash
npm run android:dev  # Opens Android Studio
```

## 📱 Deployment

### Web (Vercel)
```bash
npm run build:web
# Push to GitHub - automatic deployment via Vercel
```
**Live URL**: Will be provided by Vercel

### iOS (App Store)
```bash
npm run ios:dev
# In Xcode: Product > Archive > Upload to App Store Connect
```
See [MULTI_PLATFORM_SETUP.md](MULTI_PLATFORM_SETUP.md#ios-deployment-app-store) for details.

### Android (Play Store)
```bash
npm run android:dev
# In Android Studio: Build > Generate Signed Bundle
# Upload to Google Play Console
```
See [MULTI_PLATFORM_SETUP.md](MULTI_PLATFORM_SETUP.md#android-deployment-play-store) for details.

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Initial project setup and architecture
- **[MULTI_PLATFORM_SETUP.md](MULTI_PLATFORM_SETUP.md)** - Complete guide to building for web, iOS, and Android

## 🏗️ Tech Stack

```
Frontend:
├── React 18 + TypeScript
├── Material UI v6 (Material Design 3)
├── React Router v6 (Navigation)
└── Vite (Build Tool)

State & Data:
├── Zustand (State Management)
├── IndexedDB (Web Storage)
└── SQLite (Mobile Storage - Ready for implementation)

Mobile:
├── Capacitor 6 (Native Bridge)
├── @capacitor/camera (Photos)
├── @capacitor/filesystem (Storage)
└── @capacitor-community/contacts (Contact Integration)

Development:
├── TypeScript
├── ESLint + Prettier
└── Vitest (Testing Ready)
```

## 📂 Project Structure

```
src/
├── components/           # Shared UI components
├── features/
│   ├── dashboard/       # Main dashboard
│   └── loans/           # Loan CRUD
├── stores/              # Zustand stores
├── database/            # DB abstraction (web + mobile)
├── hooks/               # Custom React hooks
├── utils/               # Utilities (platform, currency, etc.)
├── types/               # TypeScript definitions
└── App.tsx              # App shell & routing

ios/                      # iOS Xcode project (auto-generated)
android/                  # Android Studio project (auto-generated)
```

## 🎨 Features by Platform

| Feature | Web | iOS | Android |
|---------|-----|-----|---------|
| **Dashboard** | ✅ | ✅ | ✅ |
| **Create Loans** | ✅ | ✅ | ✅ |
| **Track Repayments** | ✅ | ✅ | ✅ |
| **Search & Filter** | ✅ | ✅ | ✅ |
| **Dark Mode** | ✅ | ✅ | ✅ |
| **Contact Picker** | ❌* | ✅ | ✅ |
| **Camera** | ❌* | ✅ | ✅ |
| **Offline** | ✅ | ✅ | ✅ |

*Web: Manual input available

## 🔧 Available Scripts

```bash
# Development
npm run dev                  # Start dev server
npm run build              # Full build (web + mobile ready)
npm run build:web          # Web only
npm run build:mobile       # Build + sync to native

# Mobile
npm run ios:dev            # Open iOS in Xcode
npm run android:dev        # Open Android in Android Studio
npm run sync               # Sync changes to native projects

# Quality
npm run lint               # ESLint check
npm run preview            # Preview production build
```

## 💾 Data Storage

### Web
- **IndexedDB**: Browser's indexed database for persistent local storage
- **Preferences**: Simple key-value storage for settings

### Mobile (Development)
- **In-Memory**: Current fallback for development
- **SQLite**: Ready to implement for production (see TODO in src/database/)

## 🔐 Security

- **Local-First**: All data stored on device, no server by default
- **Type Safe**: TypeScript prevents many runtime errors
- **Permissions**: Platform-appropriate permission handling
- **Encryption Ready**: Capacitor supports encrypted storage

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Mobile Issues
See [MULTI_PLATFORM_SETUP.md#troubleshooting](MULTI_PLATFORM_SETUP.md#troubleshooting)

## 🚦 Development Status

### ✅ Completed
- Vite + React setup
- Material UI integration
- Core UI components (Dashboard, Loan form, Details)
- State management (Zustand)
- Platform detection & routing
- IndexedDB for web
- SQLite abstraction for mobile
- Build scripts for all platforms
- Capacitor iOS/Android setup

### 🔄 In Progress
- Native camera integration
- Native contacts integration
- SQLite implementation for mobile

### 📋 Planned
- Push notifications
- Cloud backup
- Multi-language support
- Advanced reporting
- Expense splitting

## 📄 License

MIT - See LICENSE file

## 👤 Author

Created with Claude Code

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues or questions:
1. Check [MULTI_PLATFORM_SETUP.md](MULTI_PLATFORM_SETUP.md)
2. Review existing GitHub issues
3. Create a new issue with details

---

**Ready to deploy?**
- 🌐 Web: `npm run build:web`
- 📱 iOS: `npm run ios:dev`
- 🤖 Android: `npm run android:dev`

See [MULTI_PLATFORM_SETUP.md](MULTI_PLATFORM_SETUP.md) for complete deployment guide.
