import { Schema, model } from "mongoose";
import { PrivateKey } from "../types";

const userSchema = new Schema<PrivateKey>({
  userId: { type: String, required: true, unique: true },
  key: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const PrivateKeyModel = model<PrivateKey>("privateKey", userSchema);

export default PrivateKeyModel;
