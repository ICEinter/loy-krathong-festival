import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/loy-krathong-festival/' : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  }
})
