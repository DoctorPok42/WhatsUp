import { verifyAuthToken } from "../../functions";
import { User } from "../../types";
import mongoose from "mongoose";

const deleteMessage = async ({ token, conversationId, messageId }: { token: string, conversationId: string, messageId: string }): Promise<{ status: string, message: string }> => {
  try {
    if (!token) return { status: "error", message: "Data not found." };

    const { id } = verifyAuthToken(token) as User["id"] | null;
    if (!id) return { status: "error", message: "Invalid token." };

    const realId = new mongoose.Types.ObjectId(messageId);

    // find and delete the message from the conversation
    const messageToDelete = await mongoose.connection.db.collection(`conversation_${conversationId}`).findOneAndDelete({ _id: realId });
    if (!messageToDelete) return { status: "error", message: "Message not found." };

    return { status: "success", message: "Message deleted." };

  } catch (error) {
    return { status: "error", message: "An error occurred." };
  }
};

export default deleteMessage;
