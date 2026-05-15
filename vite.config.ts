import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        manifest: {
          name: 'نور الإيمان - أناشيد ماهر زين',
          short_name: 'نور الإيمان',
          description: 'تطبيق أناشيد ماهر زين بدون انترنت',
          theme_color: '#4e635a',
          background_color: '#fbf9f6',
          display: 'standalone',
          icons: []
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/ia\d+\.us\.archive\.org\/.*\.mp3$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'nasheed-audio-archive',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/.*\.albumaty\.com\/.*\.mp3$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'nasheed-audio-albumaty',
                expiration: {
                  maxEntries: 100, // Increased for more nasheeds
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/www\.albumaty\.com\/.*$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'nasheed-covers-albumaty',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
                }
              }
            },
            {
              urlPattern: /^https:\/\/i1\.sndcdn\.com\/.*$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'nasheed-covers',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
                }
              }
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lucide-react')) return 'icons';
              if (id.includes('motion')) return 'animations';
              return 'vendor';
            }
          }
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
