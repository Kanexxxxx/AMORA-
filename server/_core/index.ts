import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 🧭 Corrige __dirname (modo ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Carrega o .env da raiz
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

console.log("[DEBUG] OAUTH_SERVER_URL carregado:", process.env.OAUTH_SERVER_URL);

import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth.js";
import { systemRouter } from "./systemRouter.js";
import { createContext } from "./context.js";
import { serveStatic, setupVite } from "./vite.js";

// 🔧 Testa se uma porta está livre
function isPortAvailable(port) {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

// 🔧 Busca automaticamente uma porta disponível
async function findAvailablePort(startPort = 3000) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`Nenhuma porta disponível a partir da ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  if (!process.env.OAUTH_SERVER_URL) {
    console.error("[ERRO] OAUTH_SERVER_URL não está configurado. Verifique o arquivo .env.");
  }

  registerOAuthRoutes(app);

  // 🔥 Usa o systemRouter
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: systemRouter,
      createContext,
    })
  );

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`⚠️ Porta ${preferredPort} ocupada, usando ${port} em vez dela`);
  }

  server.listen(port, () => {
    console.log(`✅ Server rodando em: http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
