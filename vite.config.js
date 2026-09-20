import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages project site: https://margogarber.github.io/HB/
export default defineConfig({
  plugins: [react()],
  base: '/HB/',
})
