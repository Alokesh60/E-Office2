# E-Office Student Dashboard

A responsive student dashboard built with React and Bootstrap 5, matching the Figma design specifications.

## Tech Stack

- React 18.2.0 (Functional Components)
- Bootstrap 5.3.2
- react-bootstrap 2.9.1
- Chart.js 4.4.0 & react-chartjs-2 5.2.0
- react-icons 4.12.0

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx
│   ├── Topbar.jsx
│   ├── ProfileCard.jsx
│   ├── ProfileCompletion.jsx
│   ├── Announcement.jsx
│   ├── ApplicationStats.jsx
│   ├── CalendarCard.jsx
│   ├── QuickAccess.jsx
│   └── RecentActivities.jsx
├── pages/
│   └── Dashboard.jsx
├── App.js
├── index.js
└── dashboard.css
```

## Components

### Sidebar
Icon-only vertical navigation with dark blue gradient background and rounded left edge.

### Topbar
- Institute logo and name (left)
- Search bar with icon (center)
- Notification bell and profile avatar (right)

### Dashboard Cards
- **Profile Card**: User photo, name, ID, and edit profile button
- **Profile Completion**: Circular progress indicator (75%)
- **Announcement**: Large card with gradient blue background
- **Application Statistics**: Donut chart with legend (Pending, Accepted, Rejected)
- **Calendar Card**: Static calendar UI with date cells
- **Quick Access**: Three action buttons
- **Recent Activities**: Empty card for future content

## Features

- Fully responsive design
- Bootstrap 5 grid system
- Chart.js donut chart for statistics
- Matches Figma design specifications
- Clean, reusable components
- No inline styles (except where necessary)

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Notes

- All images should be placed in the `images/` folder
- The logo.png file is referenced in Topbar component
- Profile image (profile.png) is used in ProfileCard
- Icons are from react-icons library
- Custom CSS is minimal, using Bootstrap utilities where possible

