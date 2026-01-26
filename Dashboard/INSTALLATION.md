# Installation Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Step-by-Step Installation

### 1. Install Dependencies
```bash
npm install
```

This will install:
- react & react-dom
- react-scripts
- bootstrap & react-bootstrap
- chart.js & react-chartjs-2
- react-icons

### 2. Verify Image Files
Ensure the following images exist in the `images/` folder:
- `logo.png` - Institute logo (used in Topbar)
- `profile.png` - User profile image (used in ProfileCard)
- `download-icon.png` - Download icon (used in QuickAccess)
- `apply-icon.png` - Application icon (used in QuickAccess)

### 3. Start Development Server
```bash
npm start
```

The application will open automatically at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## File Structure

```
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   ├── ProfileCard.jsx
│   │   ├── ProfileCompletion.jsx
│   │   ├── Announcement.jsx
│   │   ├── ApplicationStats.jsx
│   │   ├── CalendarCard.jsx
│   │   ├── QuickAccess.jsx
│   │   └── RecentActivities.jsx
│   ├── pages/
│   │   └── Dashboard.jsx
│   ├── App.js
│   ├── index.js
│   └── dashboard.css
├── images/
│   ├── logo.png
│   ├── profile.png
│   └── ... (other icons)
├── package.json
└── README.md
```

## Troubleshooting

### Issue: Images not loading
- Check that image files exist in the `images/` folder
- Verify image paths in components match actual file names
- Ensure images are imported correctly (e.g., `import logo from '../../images/logo.png'`)

### Issue: Bootstrap styles not applying
- Verify Bootstrap CSS is imported in `src/index.js`
- Check that `bootstrap` and `react-bootstrap` are installed
- Clear browser cache and restart dev server

### Issue: Chart not rendering
- Verify `chart.js` and `react-chartjs-2` are installed
- Check browser console for errors
- Ensure Chart.js is properly registered in ApplicationStats component

## Development Notes

- All components use functional components with React hooks
- Bootstrap 5 utility classes are preferred over custom CSS
- Chart.js is used for the donut chart in ApplicationStats
- SVG is used for the circular progress in ProfileCompletion
- Responsive design uses Bootstrap's grid system

