import { type Express } from "express";
import { type Server } from "http";
import { createServer as createViteServer } from "vite";

// Helper function for logging
export function log(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} [vite] ${message}`);
}

// This function sets up the Vite development server in the standard way
export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    // We don't need to specify 'root' here because your vite.config.ts
    // already correctly points to the 'client' directory.
    server: { 
      middlewareMode: true,
      // Pass the http server instance to Vite for Hot Module Replacement (HMR)
      hmr: { server }, 
    },
  });

  // Use Vite's built-in middleware to handle all front-end requests.
  // This is the only part needed.
  app.use(vite.middlewares);

  log("Vite dev middleware enabled.");
}

// This function is for serving static files in production
export function serveStatic(app: Express) {
  // Production logic would go here
  log("Serving static files in production.");
}
