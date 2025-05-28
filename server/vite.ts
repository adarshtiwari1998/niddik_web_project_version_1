import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

// Setup __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // const serverOptions = {
  //   middlewareMode: true,
  //   hmr: { server },
  //   allowedHosts: true,
  // };

  // const vite = await createViteServer({
  //   ...viteConfig,
  //   configFile: false,
  //   customLogger: {
  //     ...viteLogger,
  //     error: (msg, options) => {
  //       viteLogger.error(msg, options);
  //       process.exit(1);
  //     },
  //   },
  //   server: {
  //     middlewareMode: true,
  //     // Do NOT include: hmr: { server }
  //     // Optional: if you want HMR in dev, Vite will handle it automatically
  //   },
  //   appType: "custom",
  // });

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      console.log(`Current working directory: ${process.cwd()}`);
      console.log(`__dirname: ${__dirname}`);
      
      // Try multiple potential paths
      const clientTemplate1 = path.resolve(process.cwd(), "client", "index.html");
      const clientTemplate2 = path.resolve(__dirname, "..", "client", "index.html");
      const clientTemplate3 = path.join(process.cwd(), "client", "index.html");
      
      console.log(`Path 1 (process.cwd): ${clientTemplate1} - exists: ${fs.existsSync(clientTemplate1)}`);
      console.log(`Path 2 (__dirname): ${clientTemplate2} - exists: ${fs.existsSync(clientTemplate2)}`);
      console.log(`Path 3 (path.join): ${clientTemplate3} - exists: ${fs.existsSync(clientTemplate3)}`);
      
      // Use the first path that exists
      let clientTemplate = clientTemplate1;
      if (fs.existsSync(clientTemplate1)) {
        clientTemplate = clientTemplate1;
      } else if (fs.existsSync(clientTemplate2)) {
        clientTemplate = clientTemplate2;
      } else if (fs.existsSync(clientTemplate3)) {
        clientTemplate = clientTemplate3;
      }
      
      console.log(`Using template path: ${clientTemplate}`);
      
      // Check if template exists
      if (!fs.existsSync(clientTemplate)) {
        console.error(`Template not found at: ${clientTemplate}`);
        return next(new Error(`Template not found: ${clientTemplate}`));
      }

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      console.error("Vite template error:", e);
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}