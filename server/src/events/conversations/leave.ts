import mongoose from 'mongoose';
import { verifyAuthToken } from '../../functions';
import ConversationsModel from '../../schemas/conversations';
import UserModel from '../../schemas/users';
import { User } from '../../types';

const leave = async ({ token, conversationId }: { token: string, conversationId: string }) => {
  try {
    if (!token) return { status: "error", message: "Data not found." };
    const decoded = verifyAuthToken(token) as User | null;
    if (!decoded || !decoded.id) return { status: "error", message: "Invalid token." };

    const user = await UserModel.findById(decoded.id);
    if (!user) return { status: "error", message: "User not found." };

    const realConversationId = new mongoose.Types.ObjectId(conversationId);

    const userConversation = user.conversationsId.find((id: any) => id.toString() === realConversationId.toString());
    if (!userConversation) return { status: "error", message: "Conversation not found." };

    user.conversationsId = user.conversationsId.filter((id: any) => id.toString() !== realConversationId.toString()) as [];
    await user.save();

    const conversation = await ConversationsModel.findById(conversationId);
    if (!conversation) return { status: "error", message: "Conversation not found." };

    conversation.membersId = conversation.membersId.filter((id) => id !== decoded.id) as [];

    if (conversation.membersId.length <= 2)
      conversation.conversationType = "private";

    conversation.save();

    return { status: "success", message: "User left conversation." };

  } catch (error) {
    return { status: "error", message: "An error occurred." };
  }
}

export default leave;
