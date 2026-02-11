import { Router } from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const router = Router();

const mockUsers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "David" },
];

router.get("/", (req, res) => {
  const location = req.query.location; // e.g., /users?location=NYC
  if (location) {
    console.log(location);
  }
  // Return all users from a database
  res.json(mockUsers);
});

router.get("/:id", (req, res) => {
  const userId = req.params.id;
  // Return a specific user from a database
  const user = mockUsers.find((user) => user.id === parseInt(userId));
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.status(200).json(user);
});

router.post("/", (req, res) => {
  const newUser = req.body; // { name: "Eve" }
  mockUsers.push(newUser);
  // Save a new user to the database
  res.status(201).json({ id: mockUsers.length + 1, ...newUser });
});

router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const updatedInfo = req.body; // { name: "New Name" }
  const userIndex = mockUsers.findIndex((user) => user.id === parseInt(userId));
  if (userIndex !== -1) {
    mockUsers[userIndex] = { id: parseInt(userId), ...updatedInfo };
    res.status(200).json(mockUsers[userIndex]);
  } else {
    res.status(404).send("User not found");
  }
});

router.delete("/:id", (req, res) => {
  const userId = req.params.id;
  const userIndex = mockUsers.findIndex((user) => user.id === parseInt(userId));
  if (userIndex !== -1) {
    mockUsers.splice(userIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send("User not found");
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
