import { Schema, model } from "mongoose";
import { Message } from "../types";

const messageSchema = new Schema<Message>({
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  options: {
    isLink: { type: Boolean, default: false },
    isFile: { type: Boolean, default: false },
    data: { type: String }
  }
});

const MessageModel = model<Message>("message", messageSchema);

export default MessageModel;
