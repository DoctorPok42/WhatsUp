import { Schema, model } from "mongoose";
import { User } from "../types";

const userSchema = new Schema<User>({
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String },
  options: {
    darkMode: { type: Boolean, default: false },
    online: { type: Boolean, default: true },
    lastSeen: { type: Date, default: Date.now }
  },
  joinedAt: { type: Date, default: Date.now }
});

const UserModel = model<User>("user", userSchema);

export default UserModel;
