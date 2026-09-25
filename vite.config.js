import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Giúp deploy lên GitHub Pages mà không bị lỗi đường dẫn tương đối
  server: {
    port: 3000,
    open: false,
    host: true
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
});
