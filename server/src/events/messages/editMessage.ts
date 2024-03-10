import { DecodedToken } from "../../types";
import mongoose from "mongoose";

const editMessage = async (
  {
    conversationId,
    messageId,
    content,
  }: {
    conversationId: string;
    messageId: string;
    content: string;
  },
  decoded: DecodedToken
): Promise<{ status: string; message: string }> => {
  const realId = new mongoose.Types.ObjectId(messageId);

  // find and update the message
  const messageToEdit = await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .findOne({ _id: realId });
  if (!messageToEdit) return { status: "error", message: "Message not found." };

  if (messageToEdit.authorId !== decoded.id)
    return { status: "error", message: "You can't edit this message." };

  await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .updateOne({ _id: realId }, { $set: { content: content, edited: true } });

  return { status: "success", message: "Message edited." };
};

module.exports.params = {
  authRequired: true,
};

export default editMessage;
