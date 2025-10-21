import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import federation from '@originjs/vite-plugin-federation';
import { existsSync, copyFileSync } from 'node:fs';
import path from 'node:path';

function remoteEntryCompatPlugin() {
  return {
    name: 'remote-entry-compat',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/remoteEntry.js') {
          req.url = '/assets/remoteEntry.js';
        }
        next();
      });
    },
    closeBundle() {
      const outDir = path.resolve(process.cwd(), 'dist');
      const src = path.join(outDir, 'assets', 'remoteEntry.js');
      const dest = path.join(outDir, 'remoteEntry.js');
      if (existsSync(src)) {
        copyFileSync(src, dest);
      }
      const srcMap = path.join(outDir, 'assets', 'remoteEntry.js.map');
      const destMap = path.join(outDir, 'remoteEntry.js.map');
      if (existsSync(srcMap)) {
        copyFileSync(srcMap, destMap);
      }
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };
  const rawBase = env.VITE_APP_BASE_NAME || '';
  const base = rawBase ? (rawBase.startsWith('/') ? rawBase : `/${rawBase}`) : '/';
  const PORT = Number(env.PORT || process.env.PORT) || 3002;

  return {
    server: {
      open: true,
      port: PORT,
      host: true
    },
    build: {
      chunkSizeWarningLimit: 1000,
      sourcemap: true,
      ...(mode === 'production' && {
        esbuild: {
          drop: ['console', 'debugger'],
          pure: ['console.log', 'console.info', 'console.debug', 'console.warn']
        }
      }),
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'remoteEntry.js') {
              return 'remoteEntry.js';
            }
            return 'assets/[name]-[hash][extname]';
          }
        }
      }
    },
    preview: {
      open: true,
      host: true
    },
    define: {
      global: 'window'
    },
    resolve: {
      alias: {
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
      }
    },
    base,
    plugins: [
      react(),
      jsconfigPaths(),
      federation({
        name: 'salesApp',
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/AppWrapper.jsx'
        },
        shared: {
          react: { singleton: true, requiredVersion: '19.2.0' },
          'react-dom': { singleton: true, requiredVersion: '19.2.0' },
          'react-router-dom': { singleton: true, requiredVersion: '7.9.3' },
          '@mui/material': { singleton: true },
          '@emotion/react': { singleton: true },
          '@emotion/styled': { singleton: true },
          'react-redux': { singleton: true },
          'redux-persist': { singleton: true }
        }
      }),
      remoteEntryCompatPlugin()
    ],
    optimizeDeps: {
      include: ['@mui/material/Tooltip', 'react', 'react-dom', 'react-router-dom']
    }
  };
});
