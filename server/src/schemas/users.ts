import { Schema, model } from "mongoose";
import { User } from "../types";

const userSchema = new Schema<User>({
  phone: { type: String, required: true, unique: true },
  password: { type: String },
  username: { type: String },
  conversationsId: {
    type: [
      {
        conversationId: { type: String },
        lastMessageSeen: { type: String },
      },
    ],
    default: [],
  },
  options: {
    darkMode: { type: Boolean, default: false },
    online: { type: Boolean, default: true },
    lastSeen: { type: Date, default: Date.now },
  },
  joinedAt: { type: Date, default: Date.now },
  publicKey: { type: String },
  socketId: { type: String },
  verifCode: { type: String },
});

const UserModel = model<User>("user", userSchema);

export default UserModel;
