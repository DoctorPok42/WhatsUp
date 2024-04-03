import UserModel from "../../schemas/users";
import { DecodedToken, Message } from "../../types";
import { Socket } from "socket.io";
import mongoose from "mongoose";

const getAllMessages = async (
  {},
  decoded: DecodedToken,
  socketId: string
): Promise<{ status: string; message: string; data?: Message | null }> => {
  const author = await UserModel.findOne({ _id: decoded.id });
  if (!author)
    return { status: "error", message: "Author not found.", data: null };

  const firstUserConversations = author.conversationsId.slice(0, 10);

  const io = require("../../main").io as Socket;

  await Promise.all(
    firstUserConversations.map(async (conversation: any, index: number) => {
      console.log("conversation", conversation.conversationId);
      const findConv = await mongoose.connection.db
        .collection(`conversation_${conversation.conversationId}`)
        .find()
        .toArray();
      if (!findConv) return;

      const realPrivateKeysId = new mongoose.Types.ObjectId(
        conversation.conversationId
      );

      const conversationKey = await mongoose.connection.db
        .collection("privateKeys")
        .findOne({ conversationId: realPrivateKeysId });
      if (!conversationKey) return;

      io.to(socketId).emit("getAllMessages", {
        status: "success",
        conversationsId: conversation.conversationId,
        messages: findConv,
        nbConversations: author.conversationsId.length,
        index,
        privateKey: conversationKey.key,
      });
    })
  );

  return {
    status: "success",
    message: "All messages sent.",
  };
};

module.exports.params = {
  authRequired: true,
};

export default getAllMessages;
