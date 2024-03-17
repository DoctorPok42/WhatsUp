import UserModel from "../../schemas/users";
import { DecodedToken, Message, PrivateKey, User } from "../../types";
import mongoose from "mongoose";

const getPrivateKey = async (id: string): Promise<string | null> => {
  const realId = new mongoose.Types.ObjectId(id);

  const userPrivateKey = await mongoose.connection.db
    .collection("privateKeys")
    .findOne({ userId: realId });
  return userPrivateKey ? userPrivateKey.privateKey : null;
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
  data: Message[] | null;
  key: string | null;
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
      key: null,
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
      key: null,
    };

  const user = (await UserModel.findOne({ _id: decoded.id })) as User;

  // update the last message seen for this conversation
  const rightConversation = user.conversationsId.find((e: any) => {
    if (typeof e === "string") return false;
    if (e.conversationId.toString() === conversationId.toString()) return e;
  });

  if (rightConversation) {
    await UserModel.updateOne(
      { _id: decoded.id, "conversationsId.conversationId": conversationId },
      {
        $set: {
          "conversationsId.$.lastMessageSeen": messages[0]._id,
        },
      }
    );
  }

  return {
    status: "success",
    message: "Messages found.",
    data: messagesWithPhone.reverse(),
    key: await getPrivateKey(decoded.id),
  };
};

module.exports.params = {
  authRequired: true,
};

export default getMessages;
