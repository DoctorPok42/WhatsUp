import { Schema, model } from "mongoose";
import { Conversations, ConversationsLinks } from "../types";

const conversationsSchema = new Schema<Conversations>({
  conversationType: { type: String, required: true },
  links: { type: Array<ConversationsLinks>(), default: [] },
  files: { type: Array<ConversationsLinks>(), default: [] },
  pinnedMessages: { type: [], default: [] },
  membersId: { type: [], required: true },
  publicKey: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  lastMessage: { type: String, default: "" },
  lastMessageDate: { type: Date, default: Date.now },
  lastMessageAuthorId: { type: String, default: "" },
  lastMessageId: { type: String, default: "" },
});

const ConversationsModel = model<Conversations>("conversations", conversationsSchema);

export default ConversationsModel;
