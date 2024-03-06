import { verifyAuthToken } from "../../functions";
import { User } from "../../types";
import mongoose from "mongoose";

const editMessage = async ({ token, conversationId, messageId, content }: { token: string; conversationId: string; messageId: string; content: string }): Promise<{ status: string; message: string }> => {
  try {
    if (!token) return { status: "error", message: "Data not found." };

    const { id } = verifyAuthToken(token) as User["id"] | null;
    if (!id) return { status: "error", message: "Invalid token." };

    const realId = new mongoose.Types.ObjectId(messageId);

    // find and update the message
    const messageToDelete = await mongoose.connection.db.collection(`conversation_${conversationId}`).findOneAndUpdate(
      { _id: realId },
      { $set: { content: content, edited: true } }
    )
    if (!messageToDelete) return { status: "error", message: "Message not found." };

    return { status: "success", message: "Message edited." };

  } catch (error) {
    return { status: "error", message: "An error occurred." };
  }
};

export default editMessage;
