import express from "express";
import jsonwebtoken from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret_key";

export default function (app) {
  app.use(express.json());
  app.use("/", (req, res, next) => {
    console.log("Request received", req.method, req.url);
    // Logg our request to logg service
    next();
  });
}

export function authentication(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // authorization: "Bearer <token>" => ["Bearer", "<token>"] => "<token>"

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  try {
    const decoded = jsonwebtoken.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log("Decoded JWT:", decoded);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
}
