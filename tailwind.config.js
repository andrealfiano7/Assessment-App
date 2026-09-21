/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // UI Kit Exact Purple Tokens
        purple: {
          50: '#F7F5FF',
          100: '#AB68FF', // purple.100 from UI Kit
          200: '#6531F7', // purple.200 (Primary Accent from UI Kit)
          300: '#5624E3',
          400: '#4718CD',
          500: '#3A10B4',
        },
        // Backward-compatible periwinkle mapping to purple.200 & purple.100
        periwinkle: {
          50: '#F7F5FF',
          100: '#ECE6FF',
          200: '#D5C4FF',
          300: '#AB68FF',
          400: '#8A4FFF',
          500: '#6531F7', // Exact primary token
          600: '#5624E3',
          700: '#4718CD',
          800: '#3A10B4',
          900: '#28078A',
        },
        // UI Kit System Colors
        sys: {
          green: '#34C759',
          red: '#FF3B30',
          yellow: '#FFD967',
          orange: '#FF965E',
        },
        studio: {
          canvas: '#F8FAFD',
          card: 'rgba(255, 255, 255, 0.84)',
          panel: 'rgba(255, 255, 255, 0.90)',
          border: 'rgba(255, 255, 255, 0.85)',
          dark: '#111827',
          subtle: '#64748B',
        },
      },
      boxShadow: {
        // Effect Styles from UI Kit Specification
        'light-default': '0 0 4px rgba(101, 49, 247, 0.44), 0 0 8px rgba(101, 49, 247, 0.44)',
        'light-hover': '0 0 20px rgba(101, 49, 247, 0.44), 0 3px 6px rgba(101, 49, 247, 0.44), inset 0 0 4px rgba(255, 255, 255, 0.44)',
        'shadow-kit': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'glass-default': 'inset 0 0 1px 1px rgba(255, 255, 255, 0.44), inset 2px 2px 3px 0 rgba(255, 255, 255, 0.84)',
        'glass-hover': '0 2px 6px rgba(0, 0, 0, 0.06), inset 0 0 1px 1px rgba(255, 255, 255, 0.44), inset 2px 2px 3px 0 rgba(255, 255, 255, 0.84)',
        // Standard glass shortcuts
        'glass': '0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02), inset 0 0 1px 1px rgba(255, 255, 255, 0.6)',
        'glass-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.05), inset 0 0 1px 1px rgba(255, 255, 255, 0.6)',
        'glass-specular': 'inset 0 1px 1px rgba(255, 255, 255, 0.95)',
        'periwinkle-glow': '0 0 16px rgba(101, 49, 247, 0.40)',
        'purple-glow': '0 0 16px rgba(101, 49, 247, 0.44)',
      },
      borderRadius: {
        // UI Kit Corner Specifications
        'quaternary': '4px',
        'number': '6px',
        'secondary': '8px',
        'primary': '16px',
        'tertiary': '20px',
        '2.5xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
