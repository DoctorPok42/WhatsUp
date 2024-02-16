import { verifyAuthToken } from '../../functions';
import { User } from '../../types';
import mongoose from 'mongoose';

const searchMessage = async ({ token, conversationId, message }: { token: string, conversationId: string, message: string }) => {
  try {
    if (!token) return { status: "error", message: "Data not found." };
    const decoded = verifyAuthToken(token) as User | null;
    if (!decoded || !decoded.id) return { status: "error", message: "Invalid token." };

    const messages = await mongoose.connection.db.collection(`conversation_${conversationId}`).find({ content: new RegExp(message, "i") }).toArray();

    return { status: "success", message: "Messages found.", data: messages };

  } catch (error) {
    return { status: "error", message: "An error occurred." };
  }
}

export default searchMessage;
