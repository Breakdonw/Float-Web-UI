import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import {TanStackRouterVite} from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react-swc'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [//react(),
    TanStackRouterVite(),
    viteReact(),
  ],
  resolve:{
    alias:{
      "@": path.resolve(__dirname, "./src/")
    }
  }
})
