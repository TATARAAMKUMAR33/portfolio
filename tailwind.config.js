/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base brand — always available
        navy:  { DEFAULT: '#0B1F3A', light: '#1a3a6e', dark: '#060f1d' },
        gold:  { DEFAULT: '#D4AF37', light: '#f0d060', dark: '#a88a1a' },
        // Persona-specific — applied via CSS variables
        primary:   'var(--color-primary)',
        accent:    'var(--color-accent)',
        surface:   'var(--color-surface)',
        muted:     'var(--color-muted)',
        textMain:  'var(--color-text-main)',
        textSub:   'var(--color-text-sub)',
        border:    'var(--color-border)',
        cardBg:    'var(--color-card-bg)',
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp:   { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        pulseGold: { '0%,100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(212,175,55,0)' } },
      },
    },
  },
  plugins: [],
}
