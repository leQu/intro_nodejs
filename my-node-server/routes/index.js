import { Router } from "express";
import { authorization } from "../middleware/index.js";

const router = Router();

router.get("/admin", authorization, (req, res) => {
  res.send("Welcome to the admin panel");
});

router.get("/", (req, res) => {
  // Give us a html file"
  res.send("Hello, World!");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Authenticate user (this is just a placeholder logic)
  if (username === "admin" && password === "password") {
    res.status(200).json({ token: "Bearer secrettoken" });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

router.get("/messages", (req, res) => {
  // Return all messages from a database
  res.send("Here are some messages");
});

router.post("/messages", (req, res) => {
  // Save a new message to the database
  res.send("Message received");
});

export default router;
