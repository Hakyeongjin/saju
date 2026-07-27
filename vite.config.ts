import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// 로컬 개발은 '/', 프로덕션 빌드는 GitHub Pages 하위경로 '/saju/'
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/saju/' : '/',
  plugins: [react()],
}))
