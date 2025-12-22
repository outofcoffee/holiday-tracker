# Favicon Setup Guide

The Holiday Tracker uses different favicon sets for each holiday theme. This ensures that the browser tab icon matches the holiday being tracked.

## Directory Structure

```
public/
├── icons-easter/          # Easter Bunny favicons (pastel bunny theme)
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon-48x48.png
│   ├── apple-touch-icon-*.png (various sizes)
│   └── icon-192x192.png
│
├── icons-christmas/       # Santa Tracker favicons (Christmas theme)
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── ... (same structure as icons-easter)
│   └── README.md          # Instructions for creating Christmas icons
│
└── icons/                 # EXCLUDED - use icons-easter or icons-christmas
```

## How It Works

### Build Time

1. The `VITE_HOLIDAY_MODE` environment variable determines which icon set to use
2. The Vite plugin (`holidayManifestPlugin`) copies the appropriate icons:
   - Easter mode: copies from `public/icons-easter/` → `dist/icons/`
   - Christmas mode: copies from `public/icons-christmas/` → `dist/icons/`
3. `favicon.ico` is also copied to `dist/favicon.ico` (root level)
4. The manifest.json is generated with references to `/icons/*` paths

### Runtime

The `index.html` file contains static references to `/icons/*` paths. Since the correct icons are copied at build time, these paths will always resolve to the holiday-specific icons.

## Required Icon Sizes

Each holiday icon directory must contain:

### Favicons
- `favicon.ico` - Multi-size ICO file (16x16, 32x32, 48x48)
- `favicon-16x16.png` - Small favicon
- `favicon-32x32.png` - Standard favicon
- `favicon-48x48.png` - High DPI favicon

### Apple Touch Icons
- `apple-touch-icon-57x57.png` - iPhone (non-Retina)
- `apple-touch-icon-72x72.png` - iPad (non-Retina)
- `apple-touch-icon-114x114.png` - iPhone (Retina)
- `apple-touch-icon-144x144.png` - iPad (Retina)
- `apple-touch-icon-152x152.png` - iPad (Retina, iOS 7)
- `apple-touch-icon-180x180.png` - iPhone (Retina, iOS 8+)

### Android/Chrome
- `icon-192x192.png` - Android Chrome home screen

## Creating Christmas Icons

Christmas icons still need to be created. Here's how:

### Option 1: Using Online Tools

1. Create or find a 512x512 Santa/Christmas themed image (PNG with transparency)
2. Use [RealFaviconGenerator](https://realfavicongenerator.net/):
   - Upload your 512x512 image
   - Configure options
   - Download the generated icon pack
   - Extract to `public/icons-christmas/`

### Option 2: Using ImageMagick

```bash
# Install ImageMagick if needed
brew install imagemagick

# From a 512x512 source image
cd public/icons-christmas

# Generate all sizes
convert santa-source-512.png -resize 16x16 favicon-16x16.png
convert santa-source-512.png -resize 32x32 favicon-32x32.png
convert santa-source-512.png -resize 48x48 favicon-48x48.png
convert santa-source-512.png -resize 57x57 apple-touch-icon-57x57.png
convert santa-source-512.png -resize 72x72 apple-touch-icon-72x72.png
convert santa-source-512.png -resize 114x114 apple-touch-icon-114x114.png
convert santa-source-512.png -resize 144x144 apple-touch-icon-144x144.png
convert santa-source-512.png -resize 152x152 apple-touch-icon-152x152.png
convert santa-source-512.png -resize 180x180 apple-touch-icon-180x180.png
convert santa-source-512.png -resize 192x192 icon-192x192.png

# Create multi-size .ico file
convert santa-source-512.png -resize 48x48 \
        santa-source-512.png -resize 32x32 \
        santa-source-512.png -resize 16x16 \
        favicon.ico
```

### Design Guidelines

Christmas icons should:
- Feature Santa or Christmas elements (sleigh, presents, Santa hat, etc.)
- Use Christmas colors: red (#DC143C), green, white, gold
- Be clear and recognizable at small sizes (16x16)
- Have transparent or white background
- Match the festive theme of tracker.christmas

### Testing Icons

After creating icons:

```bash
# Build Christmas version
npm run build:christmas

# Check the icons were copied correctly
ls -la dist/icons/
ls -la dist/favicon.ico

# Start a local server to test
npx serve dist
# Visit http://localhost:3000 and check the favicon in browser tab
```

## Troubleshooting

### Icons not updating after build

1. Clear your browser cache
2. Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Check `dist/icons/` contains the expected files
4. Verify `dist/manifest.json` has correct icon references

### Wrong icons showing

1. Confirm you're using the correct build command (`build:easter` vs `build:christmas`)
2. Check `VITE_HOLIDAY_MODE` environment variable
3. Rebuild the project: `npm run build:christmas` or `npm run build:easter`

### Creating ICO files on Mac

If ImageMagick isn't creating proper ICO files:

```bash
# Use png2ico (install via npm)
npm install -g png2ico

# Create ICO from PNGs
png2ico favicon.ico favicon-16x16.png favicon-32x32.png favicon-48x48.png
```

## References

- [Web App Manifest - MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Favicon Best Practices](https://css-tricks.com/favicon-quiz/)
- [Apple Touch Icons](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
