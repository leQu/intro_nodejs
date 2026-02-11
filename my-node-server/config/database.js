import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import User from "../models/User.js";

let mongoServer;
export async function connectToDatabase() {
  try {
    mongoServer = await MongoMemoryServer.create(); // Create an in-memory MongoDB instance for demo purposes
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log("Connected to the in-memory database!");
  } catch (error) {
    console.error("Error connecting to the in-memory database:", error);
  }
}

export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log("Disconnected from the in-memory database!");
  } catch (error) {
    console.error("Error disconnecting from the in-memory database:", error);
  }
}

export async function populateMockData() {
  await User.insertMany([
    { name: "Alice", location: "NYC" },
    { name: "Bob", location: "Stockholm" },
    { name: "Charlie", location: "Chicago" },
    { name: "David", location: "Houston" },
  ]);
}
