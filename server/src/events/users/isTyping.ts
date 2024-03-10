import { Socket } from "socket.io";
import UserModel from "../../schemas/users";
import { DecodedToken, User } from "../../types";
import ConversationsModel from "../../schemas/conversations";

const isTyping = async (
  { conversationId }: { conversationId: string },
  decoded: DecodedToken
) => {
  const author = await UserModel.findOne({ _id: decoded.id });
  if (!author) return { status: "error", message: "Author not found." };

  const conversation = await ConversationsModel.findOne({
    _id: conversationId,
  });
  if (!conversation)
    return { status: "error", message: "Conversation not found." };

  const io = require("../../main").io as Socket;

  await Promise.all(
    conversation.membersId.map(async (memberId) => {
      if (memberId === decoded.id) return;
      const user = (await UserModel.findOne({ _id: memberId })) as User;
      if (!user.options.online) return;
      io.to(user.socketId).emit("isTypingUser", author.phone);
    })
  );

  return { status: "success", message: "Typing status sent." };
};

module.exports.params = {
  authRequired: true,
};

export default isTyping;
