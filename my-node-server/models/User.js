import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  location: String,
});

const credentialsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "editor", "admin"], default: "user" },
});

export const User = mongoose.model("User", userSchema);
export const Credentials = mongoose.model("Credentials", credentialsSchema);
