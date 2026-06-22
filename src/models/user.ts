import { Schema, models, model } from "mongoose";

const journalSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const moodEntrySchema = new Schema({
  date: { type: Date, default: Date.now },
  mood: { type: String, required: true },
  emotion: { type: String, required: true },
  note: { type: String },
});

const userSchema = new Schema({
  nickname: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  journals: { type: [journalSchema], default: [] },
  moodboard: { type: [moodEntrySchema], default: [] },
});

// Check if the model already exists, otherwise create it
const User = models.User || model("User", userSchema);

export default User;
