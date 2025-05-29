import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { storage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyObj, ...args) {
    capturedJsonResponse = bodyObj;
    return originalResJson.apply(res, [bodyObj, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse).substring(0, 80)}`;
      }
      console.log(logLine);
    }
  });

  next();
});

// Scheduled task to update SEO pages daily
function setupSeoScheduler() {
  const updateSeoPages = async () => {
    try {
      console.log('Running scheduled SEO pages update...');
      const results = await storage.updateAllSeoJobPages();
      console.log('Scheduled SEO update completed:', results);
    } catch (error) {
      console.error('Error in scheduled SEO update:', error);
    }
  };

  // Run daily at 2 AM
  const scheduleDaily = () => {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(2, 0, 0, 0); // 2:00 AM

    // If it's already past 2 AM today, schedule for tomorrow
    if (now > scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilScheduled = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      updateSeoPages();
      // Schedule the next run in 24 hours
      setInterval(updateSeoPages, 24 * 60 * 60 * 1000);
    }, timeUntilScheduled);

    console.log(`SEO update scheduled for: ${scheduledTime.toLocaleString()}`);
  };

  // Run initial update after 5 minutes of server start
  setTimeout(() => {
    console.log('Running initial SEO pages update...');
    updateSeoPages();
  }, 5 * 60 * 1000);

  // Schedule daily updates
  scheduleDaily();
}

(async () => {
  const server = await registerRoutes(app);

  // importantly only setup vite in development and after 
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the API routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    console.log('Registering static file handler for production...');
    await serveStatic(app);
  }

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    const formattedTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    console.log(`${formattedTime} [express] serving on port ${PORT}`);

    // Setup SEO scheduler after server starts
    setupSeoScheduler();
  });
})();