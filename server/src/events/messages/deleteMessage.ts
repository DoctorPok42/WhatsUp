import { DecodedToken, Message } from "../../types";
import mongoose from "mongoose";
import fs from "fs";
import ConversationsModel from "../../schemas/conversations";

const deleteFile = async (fileId: string, extension: string) => {
  const path = `/srv/file_storage/${fileId}.${extension}`;
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteMessage = async (
  { conversationId, messageId }: { conversationId: string; messageId: string },
  decoded: DecodedToken
): Promise<{ status: string; message: string }> => {
  const realId = new mongoose.Types.ObjectId(messageId);

  // find and delete the message from the conversation
  const messageToDelete = (await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .findOne({ _id: realId })) as Message;
  if (!messageToDelete)
    return { status: "error", message: "Message not found." };

  const lastMessage = await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .toArray();

  if (messageToDelete.authorId !== decoded.id)
    return { status: "error", message: "You can't delete this message." };

  if (lastMessage[0]._id.toString() === messageId) {
    const secondLastMessage = await mongoose.connection.db
      .collection(`conversation_${conversationId}`)
      .find()
      .sort({ _id: -1 })
      .skip(1)
      .limit(1)
      .toArray();
    await mongoose.connection.db.collection("conversations").updateOne(
      { _id: new mongoose.Types.ObjectId(conversationId) },
      {
        $set: {
          lastMessage: secondLastMessage[0].content,
          lastMessageDate: secondLastMessage[0].date,
          lastMessageAuthorId: secondLastMessage[0].authorId,
        },
      }
    );
  }

  if (messageToDelete.options.isFile && messageToDelete.options.data) {
    await Promise.resolve(
      deleteFile(
        messageToDelete.options.data.id,
        messageToDelete.options.data.type.split("/")[1]
      )
    );
    const conversation = await ConversationsModel.findOne({
      _id: conversationId,
    });
    if (!conversation)
      return { status: "error", message: "Conversation not found." };

    conversation.files = conversation.files.filter(
      (file) => file.id !== messageToDelete.options.data?.id
    );
    conversation.save();
  }

  await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .deleteOne({ _id: realId });

  return { status: "success", message: "Message deleted." };
};

module.exports.params = {
  authRequired: true,
};

export default deleteMessage;
