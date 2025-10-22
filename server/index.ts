import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectDB } from "./db";
import { config } from "./config";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 🪵 Middleware for logging API requests
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Enable CORS
    app.use(cors({
      origin: config.frontendUrl,
      credentials: true
    }));

    // Connect to MongoDB
    await connectDB();
    
    // Create HTTP server
    const server = createServer(app);

    // Register routes
    await registerRoutes(app);

    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error("Unhandled error:", err);
    });

    // Setup Vite in development mode
    if (config.nodeEnv === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start server
    server.listen(config.port, () => {
      log(`🚀 Server is running on port ${config.port} in ${config.nodeEnv} mode`);
      log(`🌐 Frontend URL: ${config.frontendUrl}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
