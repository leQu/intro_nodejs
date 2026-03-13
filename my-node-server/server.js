import express from "express";
import cluster from "cluster";
import os from "os";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

import { Credentials } from "./models/User.js";
import { users } from "./routes/index.js";
import middleware from "./middleware/index.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
  populateMockData,
} from "./config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "your_jwt_secret_key";

const numCPUs = os.cpus().length;

middleware(app);

app.use("/api/users", users);
app.post("/api/login", async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const user = await Credentials.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const userJwt = jsonwebtoken.sign(
    { userId: user.userId, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" },
  );

  res
    .status(200)
    .cookie("accessToken", userJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    })
    .json({ message: "Login successful" });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful" });
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

async function startServer() {
  await connectToDatabase();
  await populateMockData(); // Only for demo purposes, to have some initial data in the database

  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker-process ${worker.process.pid} avslutades`);
    });
  } else {
    app.listen(PORT, () => {
      console.log(`Starting server at http://localhost:${PORT}`);
    });
  }
}

process.on("SIGINT", async () => {
  console.log("\nGracefully shutting down...");
  await disconnectFromDatabase();
  process.exit(0);
});

startServer();
