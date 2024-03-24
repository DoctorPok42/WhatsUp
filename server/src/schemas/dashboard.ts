import { Schema, model } from "mongoose";
import { Dashboard } from "../types";

const dashboardSchema = new Schema<Dashboard>({
  userId: { type: String, required: true },
  messagesSendMonth: { type: Number, default: 0 },
  conversationNumber: { type: Number, default: 0 },
  lastMessageSend: { type: Date, default: -1 },
  contactsNumber: { type: Number, default: 0 },
  newContactsNumber: { type: Number, default: 0 },
});

const DashboardModel = model<Dashboard>("dashboard", dashboardSchema);

export default DashboardModel;
