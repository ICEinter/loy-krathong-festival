/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        festival: {
          gold: '#FFD700',
          amber: '#FFB800',
          night: '#0a0e1a',
          water: '#091c33'
        }
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))' },
          '50%': { opacity: '0.7', filter: 'drop-shadow(0 0 5px rgba(255, 184, 0, 0.3))' },
        }
      }
    },
  },
  plugins: [],
}

