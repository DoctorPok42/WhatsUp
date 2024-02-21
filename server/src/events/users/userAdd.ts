import { verifyAuthToken } from "../../functions";
import ConversationsModel from "../../schemas/conversations";
import UserModel from "../../schemas/users"
import { User } from "../../types";

const userAdd = async ({ token, conversationId, userId }: { token: string, conversationId: string, userId: string }) => {
  try {
    if (!token) return { status: "error", message: "Data not found." };

    const decoded = verifyAuthToken(token) as User | null;

    if (!decoded || !decoded.id) return { status: "error", message: "Invalid token." };

    const user = await UserModel.findById(decoded.id);
    if (!user) return { status: "error", message: "User not found." };

    const conversation = await ConversationsModel.findById(conversationId);
    if (!conversation) return { status: "error", message: "Conversation not found." };

    const userAlreadyIn = conversation.membersId.find((e: string) => e === userId);
    if (userAlreadyIn) return { status: "error", message: "User already in." };

    conversation.membersId.push(userId);

    if (conversation.conversationType === "private")
      conversation.conversationType = "group";

    await conversation.save();

    const addedUserConversation = await UserModel.findByIdAndUpdate(userId, { $push: { conversationsId: conversationId } });
    if (!addedUserConversation) return { status: "error", message: "An error occurred." };

    return { status: "success", message: "User has been added." };
  } catch (error) {
    return { status: "error", message: "An error occurred." };
  }
}

export default userAdd
