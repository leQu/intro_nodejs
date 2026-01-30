import { Router } from "express";
import { authorization } from "../middleware/index.js";
import { makeMessagesLookTheWayIwant } from "../transforms/messages.js";

const router = Router();

router.get("/admin", authorization, (req, res) => {
  res.send("Welcome to the admin panel");
});

router.get("/", (req, res) => {
  // Give us a html file"
  res.send("<html><body><h1>Welcome to our About Us page!</h1></body></html>");
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

router.get("/messages", async (req, res) => {
  // Return all messages from a database

  try {
    const response = await fetch("https://dummyjson.com/products/2");
    const data = await response.json();
    res.json(data);
    //res.json(makeMessagesLookTheWayIwant(data));
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(400).send("Error fetching messages");
  }
});

router.post("/messages", (req, res) => {
  // Save a new message to the database
  res.send("Message received");
});

export default router;
