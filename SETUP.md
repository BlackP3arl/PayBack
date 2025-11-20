# PayBack - Loan Tracker MVP Setup Guide

## Project Overview
A mobile-optimized web application for tracking loans to friends using React, TypeScript, and Capacitor.

## Tech Stack

### Core
- **React 18+** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Capacitor 6** - Native bridge for mobile APIs

### UI & Styling
- **Material UI (MUI) v6** - Component library with Material Design 3
- **Emotion** - CSS-in-JS styling

### State Management & Data
- **Zustand** - Lightweight state management
- **@capacitor-community/sqlite** - Local-first database

### Navigation
- **React Router v6** - Client-side routing

### Native Features
- **@capacitor/camera** - Camera and photo library access
- **@capacitor/filesystem** - File storage and management
- **@capacitor-community/contacts** - Contact list integration
- **@capacitor/preferences** - Key-value storage for settings

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - TypeScript-first schema validation

### Utilities
- **date-fns** - Date manipulation
- **framer-motion** - Animation library

## Project Structure

```
src/
├── app/               # App shell and routing
├── components/        # Shared UI components
├── features/
│   ├── dashboard/    # Dashboard page
│   └── loans/        # Loan management (CRUD)
├── stores/           # Zustand stores
├── database/         # SQLite database operations
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── theme/            # MUI theme configuration
└── types/            # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd payback-app
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

Build and deploy to mobile:

```bash
npm run build
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios    # Open in Xcode
npx cap open android # Open in Android Studio
```

## Features

### Dashboard
- View total outstanding loans
- Search and filter loans by contact name or phone
- Quick access to add new loans

### Loan Management
- Create loans with contact details
- Track partial and full repayments
- Add notes and receipt images
- View detailed loan history
- Delete loans if needed

### Data Persistence
- All data stored locally using SQLite
- Works completely offline
- Automatic synchronization on app startup

## Currency
The app uses MVR (Maldivian Rufiyaa) for all currency formatting. This is configured in:
- `src/utils/currency.ts` - Currency formatting functions
- `src/hooks/useAppTheme.ts` - Theme with currency utilities

## Dark Mode
The app automatically follows system preferences for light/dark mode. Users can override in settings (to be implemented).

## Next Steps

### Phase 2 Implementation
1. Integrate SQLite database with the Zustand store
2. Implement camera integration for receipt photos
3. Add contact selection from phone contacts
4. Create settings page for theme preferences

### Phase 3 Implementation
1. Add offline sync capabilities
2. Implement cloud backup (optional)
3. Add notifications for due loans
4. Multi-language support

## Development Notes

### Type Safety
All components and functions are fully typed with TypeScript. No `any` types used.

### CSS-in-JS
All styling uses MUI's `sx` prop and Emotion for consistency.

### State Management
Zustand stores are defined per feature:
- `appStore.ts` - Global app state (theme, initialization)
- `loanStore.ts` - Loan management state

### Database
SQLite operations are abstracted in `src/database/db.ts`. All queries return TypeScript-typed results.

## Troubleshooting

### npm install failures
If npm install fails with esbuild errors:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Capacitor plugins not found
Ensure all plugins are installed and synced:
```bash
npx cap sync
```

### Build errors
Clear the dist folder and rebuild:
```bash
rm -rf dist
npm run build
```

## Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [React Router Docs](https://reactrouter.com)
- [Material UI Docs](https://mui.com)
- [Zustand Docs](https://github.com/pmndrs/zustand)
