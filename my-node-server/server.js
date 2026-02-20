import express from "express";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

import { Credentials } from "./models/User.js";
import { users } from "./routes/index.js";
import middleware from "./middleware/index.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
  populateMockData,
} from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "your_jwt_secret_key";

middleware(app);

app.use("/users", users);

app.post("/login", async (req, res) => {
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

  const userJwtToken = jsonwebtoken.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" },
  );
  res.status(200).json({ token: userJwtToken });
});

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
