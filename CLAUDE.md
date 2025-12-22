# Holiday Tracker Implementation Plan

## Implementation Status: ✅ Multi-Holiday Support Complete

## Overview
A web application that tracks holiday characters (Easter Bunny or Santa) on their special days, showing their real-time location, animation, and delivery progress on an interactive map. The application supports multiple holidays through build-time configuration.

## Tech Stack
- **Frontend**: React with TypeScript
- **Build Tool**: Vite with custom plugins
- **Styling**: TailwindCSS with dynamic inline styles
- **Map**: Leaflet.js
- **State Management**: React Context API
- **Configuration**: Build-time holiday configuration system
- **Deployment**: Vercel/Netlify/GitHub Pages

## Supported Holidays

### Easter Bunny Tracker
- **Date Calculation**: Uses Butcher's algorithm to calculate Easter date (varies yearly)
- **Theme**: Pastel colors (pink, blue, yellow, purple, green)
- **Character**: Easter Bunny
- **Items**: Eggs, baskets, candy
- **Facts**: Easter traditions from around the world

### Santa Tracker
- **Date Calculation**: Fixed date (December 25th)
- **Theme**: Christmas colors (red, green, gold, white)
- **Character**: Santa Claus
- **Items**: Presents, stockings, candy canes
- **Facts**: Christmas traditions from around the world

## Core Features

### 1. Map Visualisation
- Interactive world map using Leaflet.js
- Custom holiday-themed styling via configuration
- Responsive design for all devices

### 2. Character Animation
- Sprite-based animation for the character
- Multiple animation states (moving, delivering, resting)
- Smooth transitions between locations
- Configurable animation styles (hop for bunny, fly for sleigh)

### 3. Global Journey Planning
- Pre-calculated path through major cities worldwide
- Population-weighted city selection
- Time-zone aware journey planning
- Extended time window covering all timezones (~38 hours)
- Interpolation for smooth transitions

### 4. Real-time Tracking
- Time-based position calculation
- Current location display with city/country name
- Delivery progress statistics
- Current time at character's location

### 5. Item Counter
- Calculate items delivered based on world population and time progress
- Animated counter for delivered items
- Configurable item names (baskets, presents)
- Percentage of journey completed

### 6. Viewer Location Features
- Browser geolocation API integration
- Nearest city calculation
- Local arrival time estimation
- Special notification when character is nearby

### 7. Holiday-Themed UI
- Dynamic color schemes from configuration
- Configurable messages and text
- Holiday-themed decorations and animations
- Fun facts about traditions worldwide

## Project Structure

```
holiday-tracker/
├── src/
│   ├── components/
│   │   ├── Map/
│   │   ├── CharacterSprite/      # Holiday character sprite (was BunnySprite)
│   │   │   ├── HolidayCharacter.tsx
│   │   │   └── holiday-character.css
│   │   ├── ProgressTracker/
│   │   ├── LocationInfo/
│   │   └── UI/
│   │       ├── OffSeasonCharacter.tsx  # (was SleepingBunny)
│   │       └── ...
│   ├── config/                   # Holiday configuration system
│   │   ├── holiday.types.ts     # Type definitions
│   │   ├── index.ts             # Main exports
│   │   └── holidays/
│   │       ├── index.ts         # Config loader
│   │       ├── easter.ts        # Easter configuration
│   │       └── christmas.ts     # Christmas configuration
│   ├── data/
│   │   ├── cities.ts
│   │   └── easterFacts.ts       # Re-exports from config
│   ├── hooks/
│   │   ├── useTracker.ts
│   │   └── ...
│   ├── context/
│   │   ├── TrackerContext.tsx
│   │   ├── TrackerContext.types.ts
│   │   └── TrackerContextDefinition.ts
│   ├── utils/
│   │   ├── timeUtils.ts         # Holiday date calculations
│   │   ├── geoUtils.ts
│   │   ├── basketCalculator.ts  # Item delivery calculations
│   │   ├── landmassDetector.ts
│   │   └── logger.ts
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
├── public/
│   ├── assets/
│   │   ├── icons8-easter-bunny-*.png
│   │   ├── santa-sleigh-100.png  # Required for Christmas mode
│   │   └── SANTA_ASSETS_README.md
│   ├── icons-easter/             # Easter-themed favicons
│   ├── icons-christmas/          # Christmas-themed favicons
│   └── manifest.json             # EXCLUDED - generated at build time
├── docs/
│   └── FAVICONS.md               # Favicon setup guide
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts                # Includes holiday plugins
├── tailwind.config.js
└── CLAUDE.md                     # This file - project documentation
```

## Holiday Configuration System

### How It Works

1. **Build-Time Selection**: Holiday mode is set via `VITE_HOLIDAY_MODE` environment variable
2. **Config Files**: Each holiday has its own configuration file in `src/config/holidays/`
3. **Runtime Access**: Configuration is imported and used throughout the app
4. **HTML Generation**: Vite plugins update index.html and manifest.json at build time

### Configuration Structure

Each holiday config includes:
- **id**: Unique identifier (`easter`, `christmas`)
- **name**: Display name
- **date**: Fixed or calculated date configuration
- **messages**: All UI text (titles, notifications, etc.)
- **colors**: Theme color palette (primary, secondary, accent, etc.)
- **assets**: Character images and icons
- **animations**: CSS animation configurations
- **deliveryItems**: Items the character delivers
- **sleepingDecorations**: Off-season decorations
- **facts**: Holiday facts array
- **itemsDeliveredName**: Label for counter (Baskets/Presents)
- **peoplePerItem**: Ratio for calculations

### Build Commands

```bash
# Development
npm run dev           # Easter mode (default)
npm run dev:easter    # Easter mode
npm run dev:christmas # Christmas mode

# Production
npm run build           # Easter mode (default)
npm run build:easter    # Easter mode
npm run build:christmas # Christmas mode
```

## Extended Time Window Logic

The tracker uses an extended time window to cover the holiday in ALL timezones:

1. **Start**: When the holiday begins in UTC+14 (Kiritimati/Christmas Island)
2. **End**: When the holiday ends in UTC-12 (Baker Island)
3. **Total Window**: ~38 hours

This ensures the character is active as long as it's the holiday anywhere in the world.

### Date Calculations

- **Easter**: Uses Butcher's algorithm in `timeUtils.ts`
- **Christmas**: Fixed date (December 25th)

Both support the extended global time window.

## Important Code Rules

1. **NO HARDCODED VALUES**: All holiday-specific content is in configuration files
2. **Use Configuration**: Import from `./config` for all holiday-specific values
3. **Dynamic Styles**: Use inline styles for colors (Tailwind doesn't support dynamic classes)
4. **Backward Compatibility**: Legacy function names preserved as aliases
5. **Async/Await**: Use for data loading operations
6. **Error Handling**: Implement proper fallbacks
7. **Performance**: Keep memory usage in mind
8. **Documentation**: Keep detailed documentation in the `docs/` folder, not in the project root

## Favicons and Manifests

### Directory Structure

Each holiday has its own set of favicons:
- **Easter**: `public/icons-easter/` - Pastel bunny-themed icons
- **Christmas**: `public/icons-christmas/` - Santa/Christmas-themed icons

### Build-Time Generation

The Vite plugin `holidayManifestPlugin` automatically:
1. Copies the correct icon set from `public/icons-${holiday}/` → `dist/icons/`
2. Copies `favicon.ico` to the root of `dist/`
3. **Generates `manifest.json`** with holiday-specific metadata:
   - Name, short name, description
   - Theme color
   - Icon references

### Required Files

Each holiday icon directory must contain:
- `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`
- Apple touch icons (57x57, 72x72, 114x114, 144x144, 152x152, 180x180)
- `icon-192x192.png` for Android/Chrome

See `docs/FAVICONS.md` for detailed instructions on creating icons.

## Adding a New Holiday

To add support for a new holiday:

1. Create new config file: `src/config/holidays/newholiday.ts`
2. Implement the `HolidayConfig` interface
3. Add to the config map in `src/config/holidays/index.ts`
4. Add build-time config in `vite.config.ts`
5. Add npm scripts in `package.json`
6. Add character assets to `public/assets/`
7. Create favicon set in `public/icons-newholiday/` (see `docs/FAVICONS.md`)

## Landmass Detection Implementation

### Design Approach

The landmass detection module determines whether coordinates are over land or water:

1. Uses a simple approach without hardcoded geographical coordinates
2. Assumes coordinates are over land by default
3. Maintains caching for performance optimization
4. Preserves API compatibility with previous implementation

### API

- `isOverLand(latitude, longitude)`: Check if a position is over land
- `isOverLandAsync(latitude, longitude)`: Async version
- `getLandmassName(latitude, longitude)`: Get landmass name
- `getLandmassNameAsync(latitude, longitude)`: Async version
- `preloadLandmassData()`: No-op for API compatibility

## Testing Strategy

- Unit tests for utility functions and hooks
- Component tests for UI elements
- Test both holiday modes
- Mock time testing via query parameters or environment variables
- Performance testing for animation smoothness

## Future Enhancements

- Additional holiday support (Diwali, Hanukkah, etc.)
- Social sharing functionality
- Interactive mini-games while waiting
- Custom messages for specific locations
- Historical journey replay
- Multiple language support
- PWA support
