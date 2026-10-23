import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // ตอน dev (vite dev server) ยิง socket.io ไปที่ backend พอร์ต 5175
      "/socket.io": { target: "http://localhost:5175", ws: true },
    },
  },
});
