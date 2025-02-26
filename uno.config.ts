// uno.config.ts
import { defineConfig, presetUno, presetAttributify, presetTypography } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
  ],
  theme: {
    colors: {
      primary: '#9333ea',
      secondary: '#4f46e5',
      success: '#14b8a6',
      danger: '#ca1738',
      warning: '#f59e0b',
      info: '#22d3ee',
      light: '#f8fafc',
      dark: '#000000',
    },
    fontFamily: {
      // Use Google Fonts "Poppins" as the primary font.
      poppins: ['Poppins', 'sans-serif'],
    },
  },
  safelist: [
    'text-primary', 'text-secondary', 'text-success', 'text-danger', 'text-warning', 'text-info', 'text-light', 'text-dark',
    'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-light', 'bg-dark',
    'font-poppins',
  ],
})
