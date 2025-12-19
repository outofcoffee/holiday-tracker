# 🎄🐰 Holiday Tracker

[![CI](https://github.com/outofcoffee/easter-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/outofcoffee/easter-tracker/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/outofcoffee/easter-tracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/outofcoffee/easter-tracker/actions/workflows/deploy.yml)

A fun, interactive web application that tracks holiday characters on their special days. Watch as the Easter Bunny hops around the world on Easter, or track Santa's sleigh on Christmas Eve!

## Features

- 🗺️ Real-time tracking on an interactive world map
- 🏙️ Journey through major cities around the world
- 🎁 Live counter of items delivered (baskets or presents)
- 📍 Personalised arrival time based on your location
- 🎨 Child-friendly, colourful design
- 🌎 Educational facts about the holiday from around the world
- 🔄 Multi-holiday support (Easter and Christmas)

## Holiday Modes

This tracker supports multiple holidays with build-time configuration:

### Easter Bunny Tracker 🐰
- Tracks the Easter Bunny delivering baskets on Easter Sunday
- Easter date is calculated automatically (varies each year)
- Features Easter-themed colors, facts, and decorations

### Santa Tracker 🎅
- Tracks Santa delivering presents on Christmas Eve/Day
- Fixed date: December 25th
- Features Christmas-themed colors, facts, and decorations

## Technology Stack

- React with TypeScript
- Vite for fast development
- TailwindCSS for styling
- Leaflet.js for interactive maps
- Vitest for testing
- Build-time configuration for multi-holiday support

## Live Demo

Check out the Easter Bunny Tracker live at: [https://easterbunny.live](https://easterbunny.live)

Development version: [https://outofcoffee.github.io/easter-tracker/](https://outofcoffee.github.io/easter-tracker/)

## Getting Started

### Prerequisites

- Node.js (v22 or newer)
- npm

If you use Node Version Manager (nvm), you can set up the correct Node.js version with:
```bash
nvm use
```
The repository includes an `.nvmrc` file that specifies the correct version.

### Installation

```bash
# Clone the repository
git clone https://github.com/outofcoffee/easter-tracker.git
cd easter-tracker

# Install dependencies
npm install

# Start the development server (defaults to Easter mode)
npm run dev
```

### Running Different Holiday Modes

```bash
# Easter Bunny Tracker
npm run dev:easter

# Santa Tracker
npm run dev:christmas
```

### Building for Production

```bash
# Build Easter version (default)
npm run build

# Build Easter version explicitly
npm run build:easter

# Build Christmas version
npm run build:christmas
```

### Adding Santa Assets

For the Christmas mode, you need to add the Santa sleigh image:

1. Place a `santa-sleigh-100.png` file in `public/assets/`
2. The image should be approximately 100x100 pixels with a transparent background

See `public/assets/SANTA_ASSETS_README.md` for more details.

### Testing with Mock Time

For testing different times of day, you can use query parameters or environment variables:

#### Using Query Parameters

Simply add one of the following query parameters to the URL:
- `mock_time`: Set specific date AND time (e.g., `?mock_time=2025-04-20T12:30:00Z` for Easter or `?mock_time=2025-12-25T12:30:00Z` for Christmas)
- `mock_date`: Set only the date but use real time

Example: `http://localhost:3000/?mock_time=2025-12-25T12:30:00Z&debug=true`

#### Using Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file to set:
   - `VITE_MOCK_TIME`: Set specific date AND time
   - `VITE_MOCK_DATE`: Set only the date
   - `VITE_HOLIDAY_MODE`: Set to `easter` or `christmas`

3. Enable debug mode to see the current simulated time:
   ```
   VITE_DEBUG=true
   ```

## Configuration Architecture

The application uses a configuration-based architecture that allows different holidays to be supported without code changes:

```
src/config/
├── holiday.types.ts      # Type definitions for holiday configuration
├── index.ts              # Main config exports
└── holidays/
    ├── index.ts          # Holiday config loader
    ├── easter.ts         # Easter Bunny configuration
    └── christmas.ts      # Santa Tracker configuration
```

Each holiday configuration includes:
- **Date calculation**: Fixed dates (Christmas) or calculated (Easter)
- **Messages**: All UI text, including titles, descriptions, and notifications
- **Colors**: Theme colors for the entire UI
- **Assets**: Character images and icons
- **Facts**: Holiday-specific facts displayed during the journey
- **Delivery items**: Items the character delivers (baskets, presents, etc.)

## Testing

```bash
npm test
```

## Project Structure

```
holiday-tracker/
├── src/
│   ├── components/
│   │   ├── Map/              # Map and location components
│   │   ├── BunnySprite/      # Character animation and marker
│   │   ├── ProgressTracker/  # Delivery progress components
│   │   ├── LocationInfo/     # User location components
│   │   └── UI/               # Header, footer, and other UI
│   ├── config/
│   │   ├── holidays/         # Holiday-specific configurations
│   │   └── holiday.types.ts  # Configuration type definitions
│   ├── data/
│   │   ├── cities.ts         # City database
│   │   └── easterFacts.ts    # Re-exports from config
│   ├── hooks/                # Custom React hooks
│   ├── context/              # Global state management
│   ├── utils/                # Utility functions
│   └── assets/               # Images and static assets
└── public/
    └── assets/               # Holiday character images
```

## How It Works

The Holiday Tracker simulates a holiday character's journey around the world. Since holidays are celebrated at different times across timezones, the journey spans approximately 38 hours - from when the day begins in the easternmost timezone (UTC+14) until it ends in the westernmost timezone (UTC-12).

### Key Features:
- **Extended Time Window**: The character is active during the entire ~38 hour global holiday period
- **Timezone-Aware Delivery**: Visits each city at midnight local time
- **Realistic Journey**: Travels from east to west, following the progression of midnight
- **Live Tracking**: See current location, city, and progress in real-time
- **Item Counting**: Watch as items are delivered across the world
- **Location-Aware**: Get personalized arrival time information
- **Off-Season Display**: Shows the character resting until the next holiday

### Date Calculations:
- **Easter**: Calculated using Butcher's algorithm (varies each year)
- **Christmas**: Fixed on December 25th

## License

This project is open source and available under the [MIT License](LICENSE).

## Deployment and CI

This project uses GitHub Actions for continuous integration and deployment.

### Continuous Integration (CI)

The CI workflow runs on all pull requests to the main branch:
1. Runs all tests
2. Performs linting
3. Verifies the build process

### Deployment

The deployment workflow automatically deploys to GitHub Pages when changes are pushed to main:
1. Sets up Node.js v22
2. Runs all tests
3. Builds the React application
4. Deploys to GitHub Pages

The workflow configurations are in:
- `.github/workflows/ci.yml` - Continuous integration
- `.github/workflows/deploy.yml` - Deployment

## Acknowledgments

- Map data from OpenStreetMap
- Holiday facts from various cultural sources
- Inspiration from the NORAD Santa Tracker
- Easter Bunny icon from Icons8

---

Created with ❤️ for holidays around the world
