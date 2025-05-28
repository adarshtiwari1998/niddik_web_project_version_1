import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import net from "net";

const app = express();

// Middleware for JSON and URL encoded requests
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static route for images
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));

// Request logging middleware
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

// Main function to register routes and set up Vite or static serving
(async () => {
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Add debug logging
  console.log(`Environment: ${app.get("env")}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

  // If in development mode, setup Vite (this will serve the frontend in memory)
  if (app.get("env") === "development" || process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite for development...");
    await setupVite(app, server);
  } else {
    console.log("Setting up static file serving for production...");
    // In production, serve static files from dist
    serveStatic(app);
  }

  // Always serve the app on port 5000
  const port = 5000;

  // Handle port already in use error
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use. Stopping existing server...`);
      // Kill any existing process on port 5000
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  // Check if port is already in use before starting
  const net = require('net');
  const portCheck = net.createServer();
  
  portCheck.listen(port, '0.0.0.0', () => {
    portCheck.close();
    server.listen(port, "0.0.0.0", () => {
      log(`Server is running on http://0.0.0.0:${port}`);
      log(`Environment: ${app.get("env")}`);
      log(`Vite development server configured successfully`);
    });
  });
  
  portCheck.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use. Please stop the existing server first.`);
      process.exit(1);
    } else {
      console.error('Port check error:', err);
      process.exit(1);
    }
  });
})();