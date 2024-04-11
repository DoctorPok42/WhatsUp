import UserModel from "../../schemas/users";
import { DecodedToken } from "../../types";
import mongoose from "mongoose";
import { decryptMessages } from "../../functions";

const getAllMessages = async (
  {},
  decoded: DecodedToken
): Promise<{ status: string; messages: string; data: any }> => {
  const author = await UserModel.findOne({ _id: decoded.id });
  if (!author)
    return { status: "error", messages: "Author not found.", data: null };

  const firstUserConversations = author.conversationsId.slice(0, 10);

  const allConversation = {} as any;

  await Promise.all(
    firstUserConversations.map(async (conversation: any, index: number) => {
      let userList = [] as { authorId: string; phone: string }[];
      let findConv = (await mongoose.connection.db
        .collection(`conversation_${conversation.conversationId}`)
        .find()
        .limit(20)
        .sort({ date: -1 })
        .toArray()) as any;
      if (!findConv) return;

      await findConv.forEach(async (message: any) => {
        if (!userList.includes(message.authorId)) {
          const user = await UserModel.findOne({ _id: message.authorId });
          if (!user) return;

          userList.push({ authorId: message.authorId, phone: "" });
          message.phone = user.phone;
        } else {
          const user = userList.find(
            (user) => user.authorId === message.authorId
          );
          if (!user) return;
          message.phone = user.phone;
        }
      });

      const realPrivateKeysId = new mongoose.Types.ObjectId(
        conversation.conversationId
      );

      const conversationKey = await mongoose.connection.db
        .collection("privateKeys")
        .findOne({ conversationId: realPrivateKeysId });
      if (!conversationKey) return;

      // Decrypt messages
      findConv = decryptMessages(findConv, conversationKey.key);

      allConversation[conversation.conversationId] = findConv.reverse();
    })
  );

  return {
    status: "success",
    messages: "All messages sent.",
    data: allConversation,
  };
};

module.exports.params = {
  authRequired: true,
};

export default getAllMessages;
