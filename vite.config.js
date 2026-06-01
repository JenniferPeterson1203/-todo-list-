import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // Added 'from' here!

// https://vite.dev/config/ for more info about configuration options
export default ({ mode }) => {
  // Load environment variables from the .env file
  const env = loadEnv(mode, '.', '');
  
  return defineConfig({
    plugins: [react()],
    server: {
      // Force the local development server to run on port 3001
      port: 3001,
      proxy: {
        // Intercept any local network requests starting with '/api'
        '/api': {
          target: env.VITE_TARGET, // The backend API target URL from our .env file
          secure: false,
          changeOrigin: true, // Rewrites the origin header to match the target URL
          configure: (proxy) => {
            // Intercept the response coming back from the API server
            proxy.on('proxyRes', (proxyRes) => {
              const cookies = proxyRes.headers['set-cookie'];
              if (!cookies) {
                return;
              }
              // Adjust cookie security attributes so they work cleanly on localhost
              const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
              proxyRes.headers['set-cookie'] = cookieArray.map((cookie) =>
                cookie
                  .replace(/; *Secure/gi, '')
                  .replace(/; *SameSite=None/gi, '')
                  .replace(/; *Domain=[^;]+/gi, '')
              );
            });
          },
        },
      },
    },
  });
};