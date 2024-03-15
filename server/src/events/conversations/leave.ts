import mongoose from "mongoose";
import ConversationsModel from "../../schemas/conversations";
import UserModel from "../../schemas/users";
import { DecodedToken } from "../../types";

const leave = async (
  { conversationId }: { conversationId: string },
  decoded: DecodedToken
) => {
  const user = await UserModel.findById(decoded.id);
  if (!user) return { status: "error", message: "User not found." };

  const realConversationId = new mongoose.Types.ObjectId(conversationId);

  const userConversation = user.conversationsId.find(
    (id: any) => id.toString() === realConversationId.toString()
  );
  if (!userConversation)
    return { status: "error", message: "Conversation not found." };

  user.conversationsId = user.conversationsId.filter(
    (id: any) => id.toString() !== realConversationId.toString()
  ) as [];
  await user.save();

  const conversation = await ConversationsModel.findById(conversationId);
  if (!conversation)
    return { status: "error", message: "Conversation not found." };

  conversation.membersId = conversation.membersId.filter(
    (id) => id !== decoded.id
  ) as [];

  if (conversation.membersId.length <= 2)
    conversation.conversationType = "private";

  if (conversation.membersId.length === 0) await conversation.deleteOne();
  else await conversation.save();

  return { status: "success", message: "User left conversation." };
};

module.exports.params = {
  authRequired: true,
};

export default leave;
