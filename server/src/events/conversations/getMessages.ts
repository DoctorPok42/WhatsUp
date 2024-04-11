import UserModel from "../../schemas/users";
import { DecodedToken, Message, User } from "../../types";
import mongoose from "mongoose";
import crypto from "crypto";

const getPrivateKey = async (id: string): Promise<string | null> => {
  const realId = new mongoose.Types.ObjectId(id);

  const userPrivateKey = await mongoose.connection.db
    .collection("privateKeys")
    .findOne({ conversationId: realId });
  return userPrivateKey ? userPrivateKey.key : null;
};

const decrypt = (messages: any[], privateKey: string) => {
  const decryptedMessages = messages.map((message: Message) => {
    if (!message || !privateKey) return null;

    try {
      const bufferEncryptedMessage =
        message && Buffer.from(message.content, "base64");
      if (!bufferEncryptedMessage) return null;
      const decryptedMessage = crypto.privateDecrypt(
        {
          key: privateKey,
          passphrase: "",
        },
        bufferEncryptedMessage
      );
      message.content = decryptedMessage.toString("utf-8");
    } catch (error) {
      return null;
    }
    return message;
  });

  return decryptedMessages;
};

const getMessages = async (
  {
    conversationId,
    messageLoaded,
  }: {
    conversationId: string;
    messageLoaded: number;
  },
  decoded: DecodedToken
): Promise<{
  status: string;
  message: string;
  data: (Message | null)[] | null;
}> => {
  // Get the last 20 messages from the conversation
  const messages = (await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .find()
    .sort({ date: -1 })
    .limit(messageLoaded + 20)
    .toArray()) as any;
  if (!messages)
    return {
      status: "error",
      message: "Messages not found.",
      data: null,
    };

  // Get the phone of the author of each message
  const messagesWithPhone = await Promise.all(
    messages.map(async (message: any) => {
      const user = (await UserModel.findOne({ _id: message.authorId })) as User;
      return { ...message, phone: user.phone };
    })
  );
  if (!messagesWithPhone)
    return {
      status: "error",
      message: "Messages not found.",
      data: null,
    };

  const user = (await UserModel.findOne({ _id: decoded.id })) as User;

  // update the last message seen for this conversation
  const rightConversation = user.conversationsId.find((e: any) => {
    if (typeof e === "string") return false;
    if (e.conversationId.toString() === conversationId.toString()) return e;
  });

  if (rightConversation) {
    await UserModel.updateOne(
      { _id: decoded.id },
      {
        $set: {
          "conversationsId.$[elem].lastMessageSeen": messagesWithPhone[0]._id,
        },
      },
      {
        arrayFilters: [{ "elem.conversationId": conversationId }],
      }
    );
  }

  // Decrypt the messages
  const privateKey = await getPrivateKey(conversationId);
  if (!privateKey)
    return { status: "error", message: "Private key not found.", data: null };

  const decryptedMessages = await decrypt(messagesWithPhone, privateKey);
  if (!decryptedMessages)
    return {
      status: "error",
      message: "Error while decrypting messages.",
      data: null,
    };

  return {
    status: "success",
    message: "Messages found.",
    data: decryptedMessages.reverse(),
  };
};

module.exports.params = {
  authRequired: true,
};

export default getMessages;
