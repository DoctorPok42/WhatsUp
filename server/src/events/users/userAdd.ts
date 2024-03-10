import mongoose from "mongoose";
import ConversationsModel from "../../schemas/conversations";
import UserModel from "../../schemas/users";
import { DecodedToken } from "../../types";

const userAdd = async (
  { conversationId, userId }: { conversationId: string; userId: string },
  decoded: DecodedToken
) => {
  const user = await UserModel.findById(decoded.id);
  if (!user) return { status: "error", message: "User not found." };

  const conversation = await ConversationsModel.findById(conversationId);
  if (!conversation)
    return { status: "error", message: "Conversation not found." };

  const userAlreadyIn = conversation.membersId.find(
    (e: string) => e === userId
  );
  if (userAlreadyIn) return { status: "error", message: "User already in." };

  conversation.membersId.push(userId);

  if (conversation.conversationType === "private")
    conversation.conversationType = "group";

  await conversation.save();

  const realConversationId = new mongoose.Types.ObjectId(conversationId);

  const addedUserConversation = await UserModel.findByIdAndUpdate(userId, {
    $push: { conversationsId: realConversationId },
  });
  if (!addedUserConversation)
    return { status: "error", message: "An error occurred." };

  return { status: "success", message: "User has been added." };
};

module.exports.params = {
  authRequired: true,
};

export default userAdd;
