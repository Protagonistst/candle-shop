import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // The Express API runs on 8787 during development (npm run dev starts both).
    proxy: { '/api': `http://localhost:${process.env.API_PORT ?? 8787}` },
  },
})
