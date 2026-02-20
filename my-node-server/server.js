import express from "express";

import { users } from "./routes/index.js";
import middleware from "./middleware/index.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
  populateMockData,
} from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 3000;

middleware(app);

app.use("/api/users", users);

async function startServer() {
  await connectToDatabase();
  await populateMockData(); // Only for demo purposes, to have some initial data in the database

  app.listen(PORT, () => {
    console.log(`Starting server at http://localhost:${PORT}`);
  });
}

process.on("SIGINT", async () => {
  console.log("\nGracefully shutting down...");
  await disconnectFromDatabase();
  process.exit(0);
});

startServer();
