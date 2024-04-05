import UserModel from "../../schemas/users";
import { DecodedToken } from "../../types";
import mongoose from "mongoose";

const getAllMessages = async (
  {},
  decoded: DecodedToken,
  socketId: string
): Promise<{ status: string; messages: string; data: any }> => {
  const author = await UserModel.findOne({ _id: decoded.id });
  if (!author)
    return { status: "error", messages: "Author not found.", data: null };

  const firstUserConversations = author.conversationsId.slice(0, 10);

  const allConversation = await Promise.all(
    firstUserConversations.map(async (conversation: any, index: number) => {
      let userList = [] as string[];
      let findConv = (await mongoose.connection.db
        .collection(`conversation_${conversation.conversationId}`)
        .find()
        .limit(20)
        .sort({ date: -1 })
        .toArray()) as any;
      if (!findConv) return;

      await findConv.forEach(async (message: any) => {
        if (!userList.includes(message.authorId))
          userList.push(message.authorId);

        const user = await UserModel.findOne({ _id: message.authorId });
        if (!user) return;

        message.phone = user.phone;
      });

      const realPrivateKeysId = new mongoose.Types.ObjectId(
        conversation.conversationId
      );

      const conversationKey = await mongoose.connection.db
        .collection("privateKeys")
        .findOne({ conversationId: realPrivateKeysId });
      if (!conversationKey) return;

      return {
        conversationId: conversation.conversationId,
        messages: findConv,
        nbConversations: author.conversationsId.length,
        index,
        privateKey: conversationKey.key,
      };
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
