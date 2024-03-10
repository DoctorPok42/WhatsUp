import UserModel from "../../schemas/users";
import { Message, User } from "../../types";
import mongoose from "mongoose";

const getMessage = async ({
  conversationId,
  messageId,
}: {
  conversationId: string;
  messageId: string;
}): Promise<{ status: string; message: string; data: Message[] | null }> => {
  // Get the message from the conversation
  const realMessageId = new mongoose.Types.ObjectId(messageId);
  const message = (await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .findOne({ _id: realMessageId })) as any;
  if (!message)
    return { status: "error", message: "Message not found.", data: null };

  // load just 10 messages before the message with the given id
  const beforeMessages = (await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .find({ date: { $lt: message.date } })
    .limit(10)
    .toArray()) as any;
  if (!beforeMessages)
    return { status: "error", message: "Messages not found.", data: null };

  // load every message after the message with the given id
  const messages = (await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .find({ date: { $gt: message.date } })
    .toArray()) as any;
  if (!messages)
    return { status: "error", message: "Messages not found.", data: null };

  // Get username of the author of each message
  for (let i = 0; i < messages.length; i++) {
    const user = (await UserModel.findOne({
      _id: messages[i].authorId,
    })) as User;
    messages[i].username = user.username;
  }

  return {
    status: "success",
    message: "Messages found.",
    data: [...beforeMessages, message, ...messages],
  };
};

module.exports.params = {
  authRequired: true,
};

export default getMessage;
