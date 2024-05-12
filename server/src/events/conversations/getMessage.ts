import { decryptMessages } from "../../functions";
import { Message } from "../../types";
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
  let message = (await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .findOne({ _id: realMessageId })) as any;
  if (!message)
    return { status: "error", message: "Message not found.", data: null };

  // load just 10 messages before the message with the given id
  let beforeMessages = (await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .find({ date: { $lt: message.date } })
    .limit(10)
    .toArray()) as any;
  if (!beforeMessages)
    return { status: "error", message: "Messages not found.", data: null };

  // load every message after the message with the given id
  let messages = (await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .find({ date: { $gt: message.date } })
    .toArray()) as any;
  if (!messages)
    return { status: "error", message: "Messages not found.", data: null };

  const realPrivateKeysId = new mongoose.Types.ObjectId(conversationId);
  const conversationKey = await mongoose.connection.db
    .collection("privateKeys")
    .findOne({ conversationId: realPrivateKeysId });
  if (!conversationKey)
    return { status: "error", message: "Key not found.", data: null };

  message = decryptMessages([message], conversationKey.key)[0];
  beforeMessages = decryptMessages(beforeMessages, conversationKey.key);
  messages = decryptMessages(messages, conversationKey.key);

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
