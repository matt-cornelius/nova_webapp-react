# Dono - React Version

This is a React/TypeScript recreation of the Flutter donation platform "Dono". It's a modern web application that makes it easier for people to discover, share, and donate to charities, nonprofits, and other mission-driven organizations.

## Features

* Social home feed showing donation activity from friends, family, and public figures
* Rich donation posts with likes, comments, and one-tap donate
* Organization profile pages with mission, goals, and donation leaderboards
* Personalized explore tab with search functionality
* Community groups and group chat
* Seamless donation flow with n8n webhook integration
* Modern, responsive UI built with Tailwind CSS

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **Lucide React** for icons
- **Context API** for state management

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DonationCard.tsx
│   ├── DonationDialog.tsx
│   └── MainNavBar.tsx
├── context/            # React Context for state management
│   └── DonationsContext.tsx
├── demo-data/           # Mock data (organizations, donations, users)
│   ├── donations.ts
│   └── organizations.ts
├── pages/               # Page components
│   ├── HomePage.tsx
│   ├── ExplorePage.tsx
│   ├── GroupsPage.tsx
│   ├── GroupChatPage.tsx
│   ├── ProfilePage.tsx
│   └── OrganizationProfilePage.tsx
├── services/            # API services
│   └── donationService.ts
├── utils/               # Utility functions
│   └── formatTime.ts
├── App.tsx              # Main app component
├── router.tsx           # Route configuration
└── main.tsx             # Entry point
```

## Environment Variables

Create a `.env` file in the root directory if you need to configure the n8n webhook URL:

```
VITE_N8N_BASE_URL=https://your-n8n-instance.com
VITE_N8N_WEBHOOK_PATH=/webhook-test/your-webhook-id
```

## Key Differences from Flutter Version

1. **State Management**: Uses React Context API instead of Riverpod
2. **Styling**: Tailwind CSS instead of Material Design 3
3. **Routing**: React Router instead of GoRouter
4. **Icons**: Lucide React instead of Material Icons
5. **HTTP**: Axios instead of the `http` package

## Features Implemented

✅ Home feed with donation cards
✅ Like functionality for donations
✅ Organization search and filtering
✅ Organization profile pages
✅ Donation dialog with amount selection
✅ Group chat interface
✅ User profile page
✅ Bottom navigation bar
✅ n8n webhook integration for donations
✅ Responsive design

## Future Enhancements

- [ ] User authentication
- [ ] Real backend API integration
- [ ] Payment processing integration
- [ ] Real-time updates
- [ ] Image uploads
- [ ] Push notifications
- [ ] Dark mode support

## Demonstration Video

This is found within this repository.
