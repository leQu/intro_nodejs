const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

async function main() {
  // 1) Start in-memory MongoDB
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // 2) Connect with Mongoose
  await mongoose.connect(uri);
  console.log("Connected to MongoDB (in-memory)");

  // 3) User schema
  const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
  });

  const User = mongoose.model("User", userSchema);

  // =====================
  // CRUD OPERATIONS
  // =====================

  // CREATE
  const createdUser = await User.create({
    name: "Alice",
    age: 30,
  });
  console.log("CREATE:", createdUser.toObject());

  // READ
  const users = await User.find();
  console.log("READ:", users.map(u => u.toObject()));

  // UPDATE
  await User.updateOne(
    { name: "Alice" },
    { age: 31 }
  );

  const updatedUser = await User.findOne({ name: "Alice" });
  console.log("UPDATE:", updatedUser.toObject());

  // DELETE
  await User.deleteOne({ name: "Alice" });

  const remainingUsers = await User.find();
  console.log("DELETE:", remainingUsers);

  // =====================
  // Clean up
  // =====================
  await mongoose.disconnect();
  await mongoServer.stop();
}

main().catch(console.error);
