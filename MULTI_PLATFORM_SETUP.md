# PayBack - Multi-Platform Setup & Deployment Guide

This document covers building and deploying PayBack as a **Web App**, **iOS App**, and **Android App** from a single codebase.

## Architecture Overview

PayBack uses **Capacitor** to enable a single React codebase to run on multiple platforms:

```
┌─────────────────────────────────────────────────────┐
│           React Source Code (Shared)                │
│  - Components, Hooks, Stores, Utilities              │
│  - Platform Detection & Fallbacks                   │
└──────────────┬──────────────────────────────────────┘
               │
       ┌───────┼────────┐
       │       │        │
    ┌──▼──┐ ┌─▼──┐ ┌───▼─┐
    │ Web │ │iOS │ │ Android
    │ PWA │ │App │ │ App
    └─────┘ └────┘ └───────┘
```

## Project Structure

```
payback-app/
├── src/
│   ├── utils/
│   │   ├── platform.ts          # Platform detection
│   │   ├── camera.ts            # Camera utilities
│   │   ├── contacts.ts          # Contacts utilities
│   │   └── currency.ts          # Currency formatting
│   ├── database/
│   │   ├── db.ts               # Main database interface
│   │   ├── sqlite-native.ts    # Native SQLite (iOS/Android)
│   │   └── sqlite-web.ts       # Web IndexedDB
│   └── ...other React files
├── ios/                         # iOS Xcode project (auto-generated)
├── android/                     # Android Studio project (auto-generated)
├── dist/                        # Built web assets
├── package.json                # Dependencies & scripts
└── capacitor.config.ts         # Capacitor configuration
```

## Build Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "build:web": "npm run build",
    "build:mobile": "npm run build && npx cap sync",
    "ios:dev": "npm run build:mobile && npx cap open ios",
    "android:dev": "npm run build:mobile && npx cap open android",
    "sync": "npx cap sync",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

## Platform-Specific Features

### Platform Detection

Use the platform detection utilities to write platform-aware code:

```typescript
import { isNativePlatform, isWeb, isIOS, isAndroid } from '@/utils/platform';

if (isNativePlatform()) {
  // Code runs on iOS/Android
  await takePhoto();
} else if (isWeb()) {
  // Code runs on web
  showFileInput();
}
```

### Camera Integration

```typescript
import { takePhoto, pickPhoto, fileToBase64 } from '@/utils/camera';

// Mobile: Native camera
if (isNativePlatform()) {
  const image = await takePhoto();
  // Returns file path
}

// Web: File input
const file = await fileInput.getFile();
const base64 = await fileToBase64(file);
```

### Contacts Integration

```typescript
import { pickContact, canAccessContacts } from '@/utils/contacts';

// Mobile only
if (canAccessContacts()) {
  const contact = await pickContact();
  // Returns name, phone, email
}

// Web: Show manual input form
```

### Database

Platform-specific database implementations are automatically selected:

```typescript
import { initDatabase, addLoan } from '@/database/db';

// Web: Uses IndexedDB
// Mobile: Uses SQLite (stub with in-memory fallback for dev)
await initDatabase();
await addLoan(loanData);
```

## Development

### Prerequisites

**For All Platforms:**
- Node.js 18+
- npm or yarn

**For iOS:**
- macOS 12+
- Xcode 14+ (install from Mac App Store)
- CocoaPods (optional, installed via Xcode)

**For Android:**
- Android Studio 2024.1+
- JDK 11+ (included with Android Studio)
- Android SDK (installed via Android Studio)

### Web Development

```bash
# Start development server
npm run dev
# Open http://localhost:5173

# Build for production
npm run build:web

# Preview production build
npm run preview
```

### iOS Development

**On macOS only:**

```bash
# Build and open in Xcode
npm run ios:dev

# In Xcode:
# - Select simulator or device
# - Press Play to run
# - Edit code in src/ and HMR updates work
# - Run `npm run sync` to rebuild and reload
```

**Key iOS Shortcuts:**
- Simulator must be running first
- After code changes: `npm run sync`
- Full rebuild: `npm run ios:dev`

### Android Development

```bash
# Build and open in Android Studio
npm run android:dev

# In Android Studio:
# - Select emulator or device
# - Click Play to run
# - Edit code in src/ and HMR updates work
# - Run `npm run sync` to rebuild and reload
```

**Key Android Shortcuts:**
- Emulator must be running first (or device connected via ADB)
- After code changes: `npm run sync`
- Full rebuild: `npm run android:dev`

### Syncing Changes

After making code changes, sync them to native projects:

```bash
npm run sync          # Sync all platforms
npm run build:mobile  # Build + sync (slower, does full build)
```

## Deployment

### Web Deployment (Vercel)

**Prerequisites:**
- GitHub account connected to Vercel
- Domain (optional)

**Automatic Deployment:**

1. Push code to GitHub
2. Vercel automatically builds and deploys
3. Each push creates a preview deployment

**Manual Deployment:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# For production
vercel --prod
```

**Configuration:**
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: None needed for MVP

**Access:**
- URL: `https://payback-[random].vercel.app`
- Can add custom domain in Vercel dashboard

### iOS Deployment (App Store)

**Prerequisites:**
- Apple Developer Account ($99/year)
- macOS computer with Xcode
- iPhone (for testing) or Simulator

**Steps:**

1. **Configure App Metadata**
   ```bash
   npm run ios:dev
   ```
   In Xcode:
   - Set Bundle Identifier: `com.payback.app`
   - Configure signing certificates in "Signing & Capabilities"
   - Add privacy descriptions in `Info.plist`

2. **Build Archive**
   ```
   Product > Archive
   ```

3. **Upload to App Store Connect**
   - Sign in with Apple ID
   - Create App ID
   - Upload archive
   - Fill app metadata (screenshots, description, etc.)
   - Submit for review (1-3 days)

4. **TestFlight (Optional)**
   - Distribute to beta testers before public release
   - Up to 10,000 external testers

**Key Files:**
- `ios/App/App/Info.plist` - App configuration
- `ios/App/App/Assets.xcassets/` - App icons and splash

### Android Deployment (Play Store)

**Prerequisites:**
- Google Play Developer Account ($25 one-time)
- Android Studio
- Android device (for testing) or Emulator

**Steps:**

1. **Generate Signed Key**
   ```bash
   npm run android:dev
   ```
   In Android Studio:
   - Build > Generate Signed Bundle/APK
   - Create new keystore or use existing
   - Select `Bundle (Android App Bundle)` format
   - Set release key options

2. **Upload to Google Play Console**
   - Sign in with Google account
   - Create app
   - Upload AAB file
   - Fill app metadata (screenshots, description, etc.)
   - Submit for review (hours to 1-2 days)

3. **Play Store Testing**
   - Can distribute to alpha/beta testers
   - Roll out to small percentage first

**Key Files:**
- `android/app/src/main/AndroidManifest.xml` - Permissions
- `android/app/src/main/res/` - App icons and resources

## Database Implementation Notes

### Current State

**Development:**
- Web: IndexedDB (browser storage)
- Mobile: In-memory fallback

**Production TODO:**
- Mobile: Implement actual SQLite using `@capacitor-community/sqlite`

### SQLite Implementation for Mobile

When ready for production mobile builds, update `src/database/sqlite-native.ts`:

```typescript
import { CapacitorSQLite } from '@capacitor-community/sqlite';

export const initNativeSQLite = async () => {
  const sqlite = new SQLiteConnection(CapacitorSQLite);
  db = await sqlite.createConnection('payback_db', false, 'no-encryption', 1, false);
  await db.open();
  // Create tables...
};
```

## Troubleshooting

### Web Issues

**IndexedDB not persisting:**
- Check browser DevTools > Application > IndexedDB
- Ensure localStorage is enabled
- Try incognito mode to check for extensions interfering

**CSS not loading:**
- Clear browser cache
- Run `npm run build:web`

### iOS Issues

**Simulator not starting:**
```bash
xcrun simctl erase all  # Reset all simulators
open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app
```

**Pod install failures:**
```bash
cd ios/App
pod install --repo-update
```

**Code signing issues:**
- Open Xcode: Xcode > Settings > Accounts
- Add Apple ID and download signing certificates
- Select team in project settings

### Android Issues

**Emulator not starting:**
```bash
android avd  # Open AVD Manager
# Create new virtual device if needed
```

**Build failures:**
```bash
cd android
./gradlew clean build  # Clean build
```

**ADB device not detected:**
```bash
adb devices  # List connected devices
adb usb     # Restart ADB over USB
```

## Environment-Specific Configuration

### `.env.development`
```
VITE_API_URL=http://localhost:3000
```

### `.env.production`
```
VITE_API_URL=https://api.payback.app
```

Load with `import.meta.env.VITE_API_URL`

## Testing on Devices

### iOS Device Testing

```bash
npm run ios:dev  # Build and run on connected iPhone
```

**Via TestFlight:**
1. Build archive in Xcode
2. Upload to App Store Connect
3. Create TestFlight build
4. Invite testers via email
5. Testers install from TestFlight app

### Android Device Testing

1. Enable Developer Mode (tap Build Number 7x in Settings)
2. Enable USB Debugging
3. Connect device via USB
4. Run: `npm run android:dev`

**Via Google Play Testing:**
1. Upload AAB to Play Console
2. Create alpha/beta testing group
3. Invite testers via Play Store link
4. Share Play Store link with testers

## Performance Optimization

### Web Bundle Size

Current: ~161KB gzipped

**To reduce:**
```typescript
// Use dynamic imports for heavy features
const HeavyComponent = React.lazy(() => import('./Heavy'));

// Tree-shake unused dependencies
// Remove unused Material UI components
```

### Mobile App Size

- iOS: ~50-100MB (depends on native dependencies)
- Android: ~40-80MB (depends on native dependencies)

## Security Considerations

### Data Storage

- **Web**: IndexedDB data stored locally, NOT encrypted by default
- **Mobile**: Should use encrypted storage in production

### Sensitive Data

Implement encryption for:
- Financial data
- Contact information
- User credentials (if adding auth)

```typescript
// Use Capacitor Preferences for encrypted settings
import { Preferences } from '@capacitor/preferences';

await Preferences.set({
  key: 'secret',
  value: encryptedData
});
```

## Maintenance

### Regular Updates

```bash
# Check for dependency updates
npm outdated

# Update Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest

# Sync plugins
npx cap sync

# Update native projects
npm run ios:dev  # Xcode will show CocoaPods updates
npm run android:dev  # Gradle will show dependency updates
```

### Monitoring

- Set up error tracking (Sentry, etc.)
- Monitor app store reviews
- Track crashes via Firebase Crashlytics

## Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [App Store Connect Help](https://help.apple.com/app-store-connect)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Xcode Documentation](https://developer.apple.com/xcode)
- [Android Studio Documentation](https://developer.android.com/studio)

## Contact & Support

For issues or questions:
1. Check troubleshooting section above
2. Review Capacitor documentation
3. Check platform-specific docs (App Store, Play Store)
4. Create issue on GitHub repository
