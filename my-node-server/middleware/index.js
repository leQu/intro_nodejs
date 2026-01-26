import express from "express";

export function authorization(req, res, next) {
  // Check if the user is authenticated
  if (req.headers.authorization === "Bearer secrettoken") {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

export default (app) => {
  app.use(express.json());
  app.use("/", (req, res, next) => {
    console.log("Request received");
    // Logg our request to logg service
    next();
  });
};
