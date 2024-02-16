import { verifyAuthToken } from "../../functions";
import UserModel from "../../schemas/users";
import { Message, User } from "../../types";
import mongoose from "mongoose";

const getMessages = async ({ token, conversationId, messageLoaded }: { token: string, conversationId: string, messageLoaded: number }): Promise<{ status: string, message: string, data: Message[] | null }> => {
  try {
    if (!token) return { status: "error", message: "Data not found.", data: null };

    const decoded = verifyAuthToken(token) as User | null;
    if (!decoded || !decoded.id) return { status: "error", message: "Invalid token.", data: null };

    // Get the last 20 messages from the conversation
    const messages = await mongoose.connection.db.collection(`conversation_${conversationId}`).find().sort({ date: -1 }).limit(messageLoaded + 20).toArray() as any;
    if (!messages) return { status: "error", message: "Messages not found.", data: null };

    // Get the phone of the author of each message
    const messagesWithPhone = await Promise.all(messages.map(async (message: any) => {
      const user = await UserModel.findOne({ _id: message.authorId }) as User;
      return { ...message, phone: user.phone };
    }));
    if (!messagesWithPhone) return { status: "error", message: "Messages not found.", data: null };

    return { status: "success", message: "Messages found.", data: messagesWithPhone.reverse() };

  } catch (error) {
    return { status: "error", message: "An error occurred.", data: null };
  }
};

export default getMessages;
