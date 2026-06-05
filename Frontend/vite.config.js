import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // allowedHosts: ['isosteric-displeasingly-nestor.ngrok-free.dev'],
    allowedHosts: true,
    port: 3000,
    proxy: {
      '/auth': 'http://localhost:5000',
      '/api': 'http://localhost:5000',
      '/users': 'http://localhost:5000',
      '/sessions': 'http://localhost:5000'
    }
  }
})