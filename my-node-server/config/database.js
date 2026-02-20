import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { MongoMemoryServer } from "mongodb-memory-server";

import { User, Credentials } from "../models/User.js";

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

  await createCredentialsUser("alex", "adminpassword", "admin");
  await createCredentialsUser("noob", "userpassword");
}

async function createCredentialsUser(username, password, role = "user") {
  const hashedPassword = await bcrypt.hash(password, 10);
  await Credentials.create({ username, password: hashedPassword, role });
}
