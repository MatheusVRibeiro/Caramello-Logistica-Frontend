// vite.config.ts
import { defineConfig } from "file:///c:/Users/xmath/OneDrive/Documentos/Projeto%20TCC/rn-log-stica-fretes-inteligentes/node_modules/vite/dist/node/index.js";
import react from "file:///c:/Users/xmath/OneDrive/Documentos/Projeto%20TCC/rn-log-stica-fretes-inteligentes/node_modules/@vitejs/plugin-react-swc/index.js";
import { VitePWA } from "file:///c:/Users/xmath/OneDrive/Documentos/Projeto%20TCC/rn-log-stica-fretes-inteligentes/node_modules/vite-plugin-pwa/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "c:\\Users\\xmath\\OneDrive\\Documentos\\Projeto TCC\\rn-log-stica-fretes-inteligentes";
var vite_config_default = defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false
    },
    middlewareMode: false,
    fs: {
      strict: true,
      allow: ["src", "node_modules"],
      deny: [".env", ".env.local", ".env.*.local"]
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Caramello Log\xEDstica",
        short_name: "Caramello",
        description: "Gest\xE3o inteligente de fretes e frotas",
        theme_color: "#1d4ed8",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "favicon.svg",
            sizes: "192x192 512x512",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      output: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFx4bWF0aFxcXFxPbmVEcml2ZVxcXFxEb2N1bWVudG9zXFxcXFByb2pldG8gVENDXFxcXHJuLWxvZy1zdGljYS1mcmV0ZXMtaW50ZWxpZ2VudGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFx4bWF0aFxcXFxPbmVEcml2ZVxcXFxEb2N1bWVudG9zXFxcXFByb2pldG8gVENDXFxcXHJuLWxvZy1zdGljYS1mcmV0ZXMtaW50ZWxpZ2VudGVzXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9jOi9Vc2Vycy94bWF0aC9PbmVEcml2ZS9Eb2N1bWVudG9zL1Byb2pldG8lMjBUQ0Mvcm4tbG9nLXN0aWNhLWZyZXRlcy1pbnRlbGlnZW50ZXMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6IFwiOjpcIixcclxuICAgIHBvcnQ6IDgwODAsXHJcbiAgICBobXI6IHtcclxuICAgICAgb3ZlcmxheTogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgbWlkZGxld2FyZU1vZGU6IGZhbHNlLFxyXG4gICAgZnM6IHtcclxuICAgICAgc3RyaWN0OiB0cnVlLFxyXG4gICAgICBhbGxvdzogW1wic3JjXCIsIFwibm9kZV9tb2R1bGVzXCJdLFxyXG4gICAgICBkZW55OiBbXCIuZW52XCIsIFwiLmVudi5sb2NhbFwiLCBcIi5lbnYuKi5sb2NhbFwiXSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgVml0ZVBXQSh7XHJcbiAgICAgIHJlZ2lzdGVyVHlwZTogXCJhdXRvVXBkYXRlXCIsXHJcbiAgICAgIGluY2x1ZGVBc3NldHM6IFtcImZhdmljb24uc3ZnXCIsIFwiYXBwbGUtdG91Y2gtaWNvbi5wbmdcIiwgXCJtYXNrZWQtaWNvbi5zdmdcIl0sXHJcbiAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgbmFtZTogXCJDYXJhbWVsbG8gTG9nXHUwMEVEc3RpY2FcIixcclxuICAgICAgICBzaG9ydF9uYW1lOiBcIkNhcmFtZWxsb1wiLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkdlc3RcdTAwRTNvIGludGVsaWdlbnRlIGRlIGZyZXRlcyBlIGZyb3Rhc1wiLFxyXG4gICAgICAgIHRoZW1lX2NvbG9yOiBcIiMxZDRlZDhcIixcclxuICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiBcIiNmZmZmZmZcIixcclxuICAgICAgICBkaXNwbGF5OiBcInN0YW5kYWxvbmVcIixcclxuICAgICAgICBzdGFydF91cmw6IFwiL1wiLFxyXG4gICAgICAgIGljb25zOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogXCJmYXZpY29uLnN2Z1wiLFxyXG4gICAgICAgICAgICBzaXplczogXCIxOTJ4MTkyIDUxMng1MTJcIixcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9zdmcreG1sXCIsXHJcbiAgICAgICAgICAgIHB1cnBvc2U6IFwiYW55IG1hc2thYmxlXCIsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgZGVkdXBlOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiXSxcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxyXG4gICAgbWluaWZ5OiBcInRlcnNlclwiLFxyXG4gICAgdGVyc2VyT3B0aW9uczoge1xyXG4gICAgICBjb21wcmVzczoge1xyXG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcclxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBjb21tZW50czogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgIHZlbmRvcjogW1wicmVhY3RcIiwgXCJyZWFjdC1kb21cIiwgXCJyZWFjdC1yb3V0ZXItZG9tXCJdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQSthLFNBQVMsb0JBQW9CO0FBQzVjLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxVQUFVO0FBSGpCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxJQUNYO0FBQUEsSUFDQSxnQkFBZ0I7QUFBQSxJQUNoQixJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsTUFDUixPQUFPLENBQUMsT0FBTyxjQUFjO0FBQUEsTUFDN0IsTUFBTSxDQUFDLFFBQVEsY0FBYyxjQUFjO0FBQUEsSUFDN0M7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUEsTUFDZCxlQUFlLENBQUMsZUFBZSx3QkFBd0IsaUJBQWlCO0FBQUEsTUFDeEUsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFFBQ2Isa0JBQWtCO0FBQUEsUUFDbEIsU0FBUztBQUFBLFFBQ1QsV0FBVztBQUFBLFFBQ1gsT0FBTztBQUFBLFVBQ0w7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQSxVQUNYO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQUEsSUFDN0IsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsZUFBZTtBQUFBLE1BQ2pCO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixVQUFVO0FBQUEsTUFDWjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLFFBQVEsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsUUFDbkQ7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
