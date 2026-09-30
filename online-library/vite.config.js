import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config: enables the React plugin (JSX + fast refresh)
export default defineConfig({ plugins: [react()] });
