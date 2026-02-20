import { Router } from "express";

import User from "../models/User.js";

const router = Router();

router.get("/", async (req, res) => {
  const location = req.query.location; // e.g., /users?location=NYC
  if (location) {
    console.log(location);
  }
  // Return all users from a database
  try {
    const users = await User.find(); // SELECT * from users;
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  // Return a specific user from a database
  try {
    const user = await User.findById(userId); // SELECT * from users WHERE id = ?
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  const newUser = req.body; // { name: "Eve", location: "LA" }
  try {
    const createdUser = await User.create(newUser); // INSERT INTO users (name, location) VALUES (?, ?)
    res.status(201).json(createdUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findByIdAndDelete(userId); // DELETE FROM users WHERE id = ?
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

/*

GET /users: Hämta alla användare.
GET /users/:id: Hämta en specifik användare.
POST /users: Skapa en ny användare.
PUT /users/:id: Uppdatera en användare.
DELETE /users/:id: Ta bort en användare.

*/

// await pool.query("SELECT * FROM shoes WHERE brand = $1", [userInput]); // This is a parameterized query that prevents SQL injection
