import { verifyAuthToken } from "../../functions";
import ConversationsModel from "../../schemas/conversations";
import { User } from "../../types";

const pinMessage = async ({ token, conversationId, messageId }: { token: string, conversationId: string, messageId: string }): Promise<{ status: string, message: string, data?: any }> => {
  try {
    if (!token) return { status: "error", message: "Data not found." };

    const { id } = verifyAuthToken(token) as User["id"] | null;
    if (!id) return { status: "error", message: "Invalid token." };

    const conversation = await ConversationsModel.findOne({ _id: conversationId });
    if (!conversation) return { status: "error", message: "Conversation not found." };

    // check if the message is already pinned
    const isPinned = conversation.pinnedMessages.includes(messageId);
    if (isPinned) {
      await ConversationsModel.updateOne({ _id: conversationId }, { $pull: { pinnedMessages: messageId } });
      return { status: "success", message: "Message unpinned.", data: conversation.pinnedMessages.filter((id: string) => id !== messageId) };
    } else {
      await ConversationsModel.updateOne({ _id: conversationId }, { $push: { pinnedMessages: messageId } });
      return { status: "success", message: "Message pinned.", data: conversation.pinnedMessages.concat(messageId) };
    }
  } catch (error) {
    return { status: "error", message: "An error occurred." };
  }
};

export default pinMessage;
