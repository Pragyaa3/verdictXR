import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // By default, Vite doesn't include shims for NodeJS/CJS globals.
      // This is needed to make things work in the browser.
      global: 'globalThis',

      // Vite's standard way to replace environment variables.
      'process.env.CANISTER_ID_COURT_BACKEND': JSON.stringify(env.CANISTER_ID_COURT_BACKEND),
      'process.env.DFX_NETWORK': JSON.stringify(env.DFX_NETWORK),
    },
  };
});