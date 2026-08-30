import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          750: '#243044',
          850: '#131d2e',
        },
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Electric Amber Primary
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        electric: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Electric Blue Accent
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f172a',
        },
        copper: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c', // Pure Annealed Copper
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        isfahan: {
          turquoise: '#14b8a6', // Turquoise dome color
          azure: '#0284c7',     // Persian tile blue
          gold: '#eab308',      // Gold accent
        }
      },
      fontFamily: {
        vazir: ['var(--font-vazirmatn)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px -2px rgba(0, 0, 0, 0.06), 0 4px 16px -2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 28px -4px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.06)',
        'electric-glow': '0 0 20px -3px rgba(245, 158, 11, 0.45)',
        'amber-glow': '0 0 25px -4px rgba(245, 158, 11, 0.45)',
        'copper-glow': '0 0 25px -4px rgba(234, 88, 12, 0.4)',
        'sky-glow': '0 0 25px -4px rgba(2, 132, 199, 0.4)',
      }
    },
  },
  plugins: [],
};

export default config;
