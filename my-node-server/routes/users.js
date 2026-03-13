import { Router } from "express";
// import redis from "redis";

import { User } from "../models/User.js";
import { authentication, authorize } from "../middleware/index.js";

import logger from "../config/logger.js";

const router = Router();

const usersCache = {};

// const client = redis.createClient({
//   url: "redis://localhost:6379",
// });

// client.on("error", (err) => console.error("Redis Client Error", err));
// await client.connect();

router.get("/", authentication, async (req, res) => {
  const location = req.query.location; // e.g., /users?location=NYC
  const userCacheKey = "usersKey";

  if (location) {
    console.log(location);
  }

  if (
    usersCache[userCacheKey] &&
    Date.now() - usersCache[userCacheKey].timestamp < 60 * 1000
  ) {
    logger.info("Users fetched from cache");
    return res.status(200).json(usersCache[userCacheKey].users);
  }

  // Return all users from a database
  try {
    // const cachedUsers = await client.get(userCacheKey);
    // if (cachedUsers) {
    //   console.log("Users fetched from cache");
    //   return res.status(200).json(JSON.parse(cachedUsers));
    // }

    const users = await User.find(); // SELECT * from users;
    // await client.set(userCacheKey, JSON.stringify(users), {
    //   EX: 60,
    // });
    usersCache[userCacheKey] = { users, timestamp: Date.now() };
    logger.info("Users fetched from database, cache updated");

    res.status(200).json(users);
  } catch (error) {
    logger.info("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/details", authentication, async (req, res) => {
  const userId = req.user.userId;
  // Return a specific user from a database
  console.log("Authenticated user ID:", userId);
  try {
    const user = await User.findById(userId); // SELECT * from users WHERE id = ?
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", authentication, async (req, res) => {
  const newUser = req.body; // { name: "Eve", location: "LA" }
  try {
    const createdUser = await User.create(newUser); // INSERT INTO users (name, location) VALUES (?, ?)
    res.status(201).json(createdUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", authentication, async (req, res) => {
  const userId = req.params.id;
  const updatedInfo = req.body; // { name: "New Name", location: "New Location" }
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedInfo, {
      new: true,
    }); // UPDATE users SET name = ?, location = ? WHERE id = ?
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete(
  "/:id",
  authentication,
  authorize(["delete"]),
  async (req, res) => {
    const userId = req.params.id;
    try {
      await User.findByIdAndDelete(userId); // DELETE FROM users WHERE id = ?
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

export default router;

/*

GET /users: Hämta alla användare.
GET /users/:id: Hämta en specifik användare.
POST /users: Skapa en ny användare.
PUT /users/:id: Uppdatera en användare.
DELETE /users/:id: Ta bort en användare.

*/

// await pool.query("SELECT * FROM shoes WHERE brand = $1", [userInput]); // This is a parameterized query that prevents SQL injection
