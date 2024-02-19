import path from 'path';
import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('osio3', 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: '/src/index.js',
    },
  },
  base: '/dist/'
};