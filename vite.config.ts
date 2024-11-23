import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Redirige las solicitudes que comiencen con "/api" al backend
      "/api": {
        target: "http://www.registroreparacionesmantenimientos.somee.com", // URL de tu backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Elimina el prefijo "/api"
      },
    },
  },
});
