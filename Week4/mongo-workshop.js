import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

async function main() {
  // Create an in-memory MongoDB instance
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri);

  console.log("Connected to the in-memory database!");

  // Define a sample schema and model
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: String,
  });

  const User = mongoose.model("User", userSchema);

  // Create and insert some random data

  const insertSingleUser = await User.create({
    name: "Alice",
    city: "New York",
  });

  console.log("Single user created:", insertSingleUser);

  const insertMultipleUsers = await User.insertMany([
    { name: "Bob", city: "Los Angeles" },
    { name: "Charlie", city: "Chicago" },
    { name: "David", city: "Los Angeles" },
  ]);

  console.log("\n\nSample data inserted:", insertMultipleUsers);

  const findSingleUser = await User.findOne({ city: "Chicago" });

  console.log("\n\nRead user:", findSingleUser);

  const findMultipleUsers = await User.find({ city: "Los Angeles" });

  console.log("\n\nRead users from Los Angeles:", findMultipleUsers);

  const updateSingleUser = await User.findOneAndUpdate(
    { city: "Chicago" },
    { city: "Stockholm" },
    { new: true },
  );

  console.log("\n\nUpdated user:", updateSingleUser);

  const updateMultipleUsers = await User.updateMany(
    { city: "Los Angeles" },
    { city: "San Francisco" },
  );

  const allUsers = await User.find();

  console.log("\n\nAll users in the database:", allUsers);

  // Delete users from San Francisco

  const deleteSingleUser = await User.findOneAndDelete({ city: "Stockholm" });

  const deleteMultipleUsers = await User.deleteMany({ city: "San Francisco" });

  const remainingUsers = await User.find();
  console.log("\n\nRemaining users after deletions:", remainingUsers);

  // Clean up and disconnect
  await mongoose.disconnect();
  await mongoServer.stop();
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
