import mongoose from "mongoose";
import ConversationsModel from "../../schemas/conversations";
import UserModel from "../../schemas/users";
import { DecodedToken, User } from "../../types";

const leave = async (
  { conversationId }: { conversationId: string },
  decoded: DecodedToken
) => {
  const user = (await UserModel.findById(decoded.id)) as User;
  if (!user) return { status: "error", message: "User not found." };

  // Check if conversation exists
  const conversation = await ConversationsModel.findById(conversationId);
  if (!conversation)
    return { status: "error", message: "Conversation not found." };

  // Check if user is in conversation
  const userConversation = user.conversationsId.find(
    (conv: any) => conv.conversationId === conversationId
  );
  if (!userConversation)
    return { status: "error", message: "Conversation not found." };

  // if user is in conversation and conversation exists, remove user from conversation
  user.conversationsId = user.conversationsId.filter(
    (conv: any) => conv.conversationId !== conversationId
  );
  await user.save();

  conversation.membersId = conversation.membersId.filter(
    (id) => id !== decoded.id
  ) as [];

  console.log(conversation.membersId);

  if (conversation.membersId.length <= 3)
    conversation.conversationType = "private";

  if (conversation.membersId.length <= 2) {
    await conversation.deleteOne();
    mongoose.connection.db.dropCollection(`conversation_${conversationId}`);
  }
  else await conversation.save();

  return { status: "success", message: "User left conversation." };
};

module.exports.params = {
  authRequired: true,
};

export default leave;
