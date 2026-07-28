import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages 빌드에서만 하위경로 '/saju/', 그 외(Vercel·로컬)는 루트 '/'
export default defineConfig(() => ({
  base: process.env.GITHUB_PAGES ? '/saju/' : '/',
  plugins: [react()],
}))
