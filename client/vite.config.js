import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:9000',
          // target: 'https://04projectblogging-production.up.railway.app',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'production' ? false : true, // Disable source maps in production for better performance
      minify: mode === 'production' ? 'terser' : false, // Use Terser for minification in production
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode), // Define environment variables for better optimization
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [], // Remove console logs and debuggers in production
    },
    optimizeDeps: {
      include: ['react', 'react-dom'], // Pre-bundle dependencies for faster builds
    },
  };
});
