import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // basicSsl()
  ],
  base: '/bankdemo',
  server: {
    proxy: {
      '/bankdemo/api': {
        target: "http://ips-stg.napas.com.vn:8082/",
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log(
              "Sending Request:",
              req.method,
              req.url,
              " => TO THE TARGET =>  ",
              proxyReq.method,
              proxyReq.protocol,
              proxyReq.host,
              proxyReq.path,
              JSON.stringify(proxyReq.getHeaders()),
            );
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url,
              JSON.stringify(proxyRes.headers),
            );
          });
        },
        // rewrite: path => path.replace(/^\/api/, '')

      }
    }
  }
})
