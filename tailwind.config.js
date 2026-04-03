/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      borderRadius: {
        xl: '1rem',
        lg: '0.85rem',
        md: '0.65rem',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Sora"', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 18px 40px rgba(6, 12, 36, 0.45)',
        soft: '0 10px 30px rgba(13, 26, 69, 0.35)',
      },
      backgroundImage: {
        noise:
          'radial-gradient(circle at 20% 20%, rgba(110,137,255,0.16) 0%, rgba(110,137,255,0) 38%), radial-gradient(circle at 85% 8%, rgba(81,118,255,0.2) 0%, rgba(81,118,255,0) 32%), linear-gradient(180deg, rgba(8,16,45,1) 0%, rgba(5,11,32,1) 100%)',
      },
    },
  },
  plugins: [],
}

