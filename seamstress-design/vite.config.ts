/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { fileURLToPath } from 'url';
import { viteGitPlugin } from './src/plugins/viteGitPlugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  // Serve at root - no base path needed
  plugins: [
    react({
      include: ['src/**/*.{jsx,tsx}']
    }),
    svgr(),
    viteGitPlugin()
  ],
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version || '0.0.0'),
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  build: {
    target: 'esnext',
    minify: 'esbuild', // esbuild uses far less memory than terser
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          // React ecosystem
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // MUI Core - split into 3 chunks for better caching
          'vendor-mui-core': ['@mui/material', '@mui/system'],
          'vendor-mui-icons': ['@mui/icons-material'],
          'vendor-mui-extras': ['@mui/lab', '@mui/x-data-grid'],

          // OpenGov - keep as one chunk to avoid circular dependencies
          'vendor-opengov': [
            '@opengov/components-page-header',
            '@opengov/components-pagination',
            '@opengov/components-result',
            '@opengov/components-file-management',
            '@opengov/components-ai-patterns',
            '@opengov/components-nav-bar'
          ],

          // Editor (keep as is)
          'vendor-editor': ['@tiptap/core', '@tiptap/react', '@tiptap/starter-kit'],

          // Heavy visualization libraries - separate chunks
          'vendor-charts': ['recharts'],
          'vendor-viz': ['vis-network', 'vis-data']
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    reportCompressedSize: false
  },
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'react',
      'react-dom',
      'react-router-dom'
    ],
    exclude: [],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
      },
    }
  },
  server: {
    hmr: {
      overlay: false
    }
  },
  esbuild: {
    legalComments: 'none',
    drop: ['debugger']
  }
});