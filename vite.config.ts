import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Holiday configurations for build-time HTML generation
// These mirror the runtime config but are available at build time
const holidayConfigs = {
  easter: {
    title: 'Easter Bunny Tracker',
    description: "Track the Easter Bunny's journey around the world on Easter Day!",
    themeColor: '#f3eac3',
    appName: 'Easter Bunny Tracker',
    shortName: 'Bunny Tracker',
  },
  christmas: {
    title: 'Santa Tracker',
    description: "Track Santa's journey around the world on Christmas Day!",
    themeColor: '#DC143C',
    appName: 'Santa Tracker',
    shortName: 'Santa Tracker',
  },
};

// Get the holiday mode from environment variable
const holidayMode = (process.env.VITE_HOLIDAY_MODE || 'easter') as keyof typeof holidayConfigs;
const holidayConfig = holidayConfigs[holidayMode] || holidayConfigs.easter;

// Plugin to transform HTML with holiday-specific values
function holidayHtmlPlugin(): Plugin {
  return {
    name: 'holiday-html-plugin',
    transformIndexHtml(html) {
      return html
        .replace(/<title>.*<\/title>/, `<title>${holidayConfig.title}</title>`)
        .replace(
          /<meta name="description" content="[^"]*"/,
          `<meta name="description" content="${holidayConfig.description}"`
        )
        .replace(
          /<meta name="theme-color" content="[^"]*"/,
          `<meta name="theme-color" content="${holidayConfig.themeColor}"`
        );
    },
  };
}

// Plugin to copy holiday-specific icons and generate manifest.json
function holidayManifestPlugin(): Plugin {
  return {
    name: 'holiday-manifest-plugin',
    writeBundle() {
      const distPath = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distPath)) {
        return;
      }

      // Copy holiday-specific icons to dist/icons
      const sourceIconsDir = path.resolve(__dirname, `public/icons-${holidayMode}`);
      const destIconsDir = path.join(distPath, 'icons');

      // Create icons directory in dist
      if (!fs.existsSync(destIconsDir)) {
        fs.mkdirSync(destIconsDir, { recursive: true });
      }

      // Copy all icon files
      if (fs.existsSync(sourceIconsDir)) {
        const iconFiles = fs.readdirSync(sourceIconsDir).filter(
          (file) => file.endsWith('.png') || file.endsWith('.ico')
        );

        if (iconFiles.length === 0) {
          console.warn(
            `\n⚠️  Warning: No icons found in ${sourceIconsDir}/\n` +
              `   Please add ${holidayMode} favicons. See FAVICONS.md for instructions.\n`
          );
        } else {
          iconFiles.forEach((file) => {
            const sourcePath = path.join(sourceIconsDir, file);
            const destPath = path.join(destIconsDir, file);
            fs.copyFileSync(sourcePath, destPath);
          });

          // Also copy favicon.ico to root of dist
          const faviconSource = path.join(sourceIconsDir, 'favicon.ico');
          if (fs.existsSync(faviconSource)) {
            fs.copyFileSync(faviconSource, path.join(distPath, 'favicon.ico'));
          }

          console.log(`✓ Copied ${iconFiles.length} ${holidayMode} icons to dist/icons/`);
        }
      } else {
        console.warn(
          `\n⚠️  Warning: Icons directory not found: ${sourceIconsDir}/\n` +
            `   Please create it and add ${holidayMode} favicons. See FAVICONS.md for instructions.\n`
        );
      }

      // Generate manifest.json
      const manifest = {
        name: holidayConfig.appName,
        short_name: holidayConfig.shortName,
        description: holidayConfig.description,
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: holidayConfig.themeColor,
        icons: [
          { src: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
          { src: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
          { src: '/icons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
          { src: '/icons/apple-touch-icon-57x57.png', sizes: '57x57', type: 'image/png' },
          { src: '/icons/apple-touch-icon-72x72.png', sizes: '72x72', type: 'image/png' },
          { src: '/icons/apple-touch-icon-114x114.png', sizes: '114x114', type: 'image/png' },
          { src: '/icons/apple-touch-icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/icons/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
          { src: '/icons/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        ],
      };

      fs.writeFileSync(path.join(distPath, 'manifest.json'), JSON.stringify(manifest, null, 2));
    },
  };
}

let base = '/';
if (process.env.GITHUB_PAGES === 'true') {
  base = '/holiday-tracker/';
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), holidayHtmlPlugin(), holidayManifestPlugin()],
  base,
  define: {
    // Make holiday mode available at runtime as well
    'import.meta.env.VITE_HOLIDAY_MODE': JSON.stringify(holidayMode),
  },
  publicDir: 'public',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: [],
  },
});
