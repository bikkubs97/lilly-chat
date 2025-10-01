import mongoose, { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  nickname: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Check if the model already exists, otherwise create it
const User = models.User || model("User", userSchema);

export default User;
