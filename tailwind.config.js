/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Legacy Easter colors for backward compatibility
        // Note: Dynamic holiday colors are now applied via inline styles
        easter: {
          pink: '#FFB6C1',
          blue: '#ADD8E6',
          yellow: '#FFFACD',
          purple: '#E6E6FA',
          'dark-purple': '#6A0DAD',
          green: '#98FB98',
        },
        // Christmas colors (for reference, dynamic colors are used via config)
        christmas: {
          red: '#DC143C',
          green: '#228B22',
          gold: '#FFD700',
          white: '#FFFAFA',
          'dark-red': '#8B0000',
          'ice-blue': '#00CED1',
        },
      },
      animation: {
        hop: 'hop 0.8s ease-in-out infinite',
        fly: 'fly 1.2s ease-in-out infinite',
      },
      keyframes: {
        hop: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fly: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-8px) rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
};
