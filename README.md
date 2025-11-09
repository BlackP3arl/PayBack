# PayBack - Loan Tracker MVP

A mobile application built with React Native (Expo) that helps users track money they have lent to friends and manage loan repayments in an organized and visual way.

## Features

### Core Features
- **Contact Integration**: Select friends directly from your phone's contact list
- **Loan Management**: Track loans with amount, dates, notes, and receipt attachments
- **Repayment Tracking**: Record partial or full repayments with receipts
- **Visual Dashboard**: See total outstanding amount and per-person balances at a glance
- **Detailed Views**: View comprehensive loan details and repayment history
- **Search & Filter**: Quickly find contacts and their loans
- **Currency Support**: MVR currency formatting throughout the app
- **Dark Mode**: Automatic light/dark theme based on system preferences
- **Data Persistence**: All data stored locally using SQLite

### Technical Features
- **Local-First**: SQLite database for fast, offline-first data storage
- **Image Attachments**: Camera and photo library integration for receipts
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: React Native Paper components with Material Design
- **State Management**: Zustand for efficient state handling
- **Responsive Navigation**: Stack navigation with React Navigation

## Tech Stack

- **Framework**: React Native (Expo ~54.0)
- **Language**: TypeScript
- **UI Library**: React Native Paper (Material Design 3)
- **Navigation**: React Navigation (Native Stack)
- **State Management**: Zustand
- **Database**: SQLite (expo-sqlite)
- **Date Handling**: date-fns
- **Image Handling**: expo-image-picker
- **Contacts**: expo-contacts

## Project Structure

```
PayBack/
├── src/
│   ├── screens/           # All screen components
│   │   ├── HomeScreen.tsx
│   │   ├── ContactSelectorScreen.tsx
│   │   ├── AddLoanScreen.tsx
│   │   ├── LoanSummaryScreen.tsx
│   │   ├── LoanDetailScreen.tsx
│   │   └── AddRepaymentScreen.tsx
│   ├── navigation/        # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── store/            # Zustand state management
│   │   └── index.ts
│   ├── database/         # SQLite database operations
│   │   └── index.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   └── format.ts
│   └── constants/        # App constants and themes
│       └── theme.ts
├── App.tsx               # Main app component
├── app.json             # Expo configuration
└── package.json         # Dependencies

```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator or physical device with Expo Go app

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PayBack
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
# or
npx expo start
```

4. Run on your preferred platform:
```bash
# iOS (Mac only)
npm run ios

# Android
npm run android

# Web
npm run web
```

### Running on Physical Device

1. Install the Expo Go app on your iOS or Android device
2. Scan the QR code displayed in the terminal after running `npm start`
3. The app will load on your device

## Usage Guide

### Adding a Loan

1. From the home screen, tap the **+ New Loan** button
2. Select a contact from your phone's contact list
3. Enter the loan details:
   - Loan amount (MVR)
   - Date issued (defaults to today)
   - Due date
   - Optional notes
   - Optional receipt attachment (camera or photo library)
4. Tap **Add Loan**

### Recording a Repayment

1. Navigate to a contact's loan summary
2. Tap on a specific loan to view details
3. Tap the **+ Add Repayment** button
4. Enter repayment details:
   - Repayment amount
   - Repayment date
   - Optional notes
   - Optional receipt attachment
5. Tap **Add Repayment**

### Viewing Loan Details

- **Dashboard**: Shows total outstanding amount and list of all contacts with loans
- **Loan Summary**: Shows all loans for a specific contact
- **Loan Details**: Shows complete loan information, payment history, and attached receipts

## Database Schema

### Contacts Table
```sql
- id (TEXT, PRIMARY KEY)
- name (TEXT, NOT NULL)
- phoneNumber (TEXT)
- email (TEXT)
- createdAt (TEXT, NOT NULL)
```

### Loans Table
```sql
- id (TEXT, PRIMARY KEY)
- contactId (TEXT, FOREIGN KEY)
- amount (REAL, NOT NULL)
- dateIssued (TEXT, NOT NULL)
- dueDate (TEXT, NOT NULL)
- notes (TEXT)
- attachmentUri (TEXT)
- createdAt (TEXT, NOT NULL)
- updatedAt (TEXT, NOT NULL)
```

### Repayments Table
```sql
- id (TEXT, PRIMARY KEY)
- loanId (TEXT, FOREIGN KEY)
- amount (REAL, NOT NULL)
- repaymentDate (TEXT, NOT NULL)
- notes (TEXT)
- attachmentUri (TEXT)
- createdAt (TEXT, NOT NULL)
```

## Permissions Required

### iOS
- Contacts access
- Camera access
- Photo library access

### Android
- READ_CONTACTS
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE

## Future Enhancements

Potential features for future versions:
- Cloud sync with Supabase/Firebase
- Export loan data to CSV/PDF
- Reminders for overdue loans
- Multi-currency support
- Loan categories/tags
- Statistics and analytics
- Loan editing capabilities
- Backup and restore functionality

## Development Notes

### Key Design Decisions

1. **Local-First Architecture**: SQLite provides fast, offline-first data storage
2. **Immutable Loan Amounts**: Once created, loan amounts cannot be changed to maintain data integrity
3. **Flexible Repayments**: Support for partial payments and overpayments
4. **Attachment Storage**: Images stored locally with file path references
5. **MVR Currency**: Hardcoded for MVP, designed to be easily extended for multi-currency

### Testing

To test the app:
1. Ensure you have contacts in your phone's contact list
2. Grant all necessary permissions when prompted
3. Test the complete workflow: add loan → add repayment → view details

## Troubleshooting

### Common Issues

**Issue**: Contacts not loading
- **Solution**: Ensure you've granted contacts permission in your device settings

**Issue**: Camera/Photos not working
- **Solution**: Grant camera and photo library permissions in device settings

**Issue**: Database errors
- **Solution**: Clear app data and restart (development only)

## License

This project is part of a personal portfolio/learning project.

## Contact

For questions or feedback, please open an issue in the repository.

---

Built with ❤️ using React Native and Expo
