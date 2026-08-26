import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D7A3A',
          light: '#E8F5E9',
          dark: '#1B5E20',
          50: '#F4FAF5',
          100: '#E8F5E9',
          200: '#C8E6C9',
          500: '#2D7A3A',
          600: '#256B32',
          700: '#1E5828',
          800: '#1B5E20',
          900: '#0F3813',
        },
        accent: {
          DEFAULT: '#FF8F00',
          light: '#FFF3E0',
          dark: '#E65100',
          50: '#FFF8E1',
          100: '#FFF3E0',
          500: '#FF8F00',
          600: '#F57C00',
        },
        surface: '#FFFFFF',
        background: '#FAFAFA',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
