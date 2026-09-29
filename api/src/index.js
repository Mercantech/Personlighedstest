import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { pool } from "./db.js";
import { router } from "./routes.js";

const app = express();
app.use(
  cors({
    origin: config.corsOrigin.split(",").map((s) => s.trim()),
    credentials: false,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use("/api", router);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "server_error" });
});

const server = app.listen(config.port, config.host, () => {
  console.log(`Samspil API på http://${config.host}:${config.port}`);
});

async function shutdown() {
  server.close();
  await pool.end();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
