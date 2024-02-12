import { verifyAuthToken } from "../../functions";
import ConversationsModel from "../../schemas/conversations";
import { Conversations, User } from "../../types";
import mongoose from "mongoose";

const conversationsChoose = async ({ token, userId }: { token: string, userId: User["id"] }): Promise<{ status: string, message: string, data: Conversations | null }> => {
  try {
    if (!token) return { status: "error", message: "Data not found.", data: null };

    const decoded = verifyAuthToken(token) as any;
    if (!decoded || !decoded.id) return { status: "error", message: "Invalid token.", data: null };

    // Check if the conversation already exists (check in both ways, to avoid duplicates)
    const userInfos = await ConversationsModel.findOne({ membersId: { $all: [decoded.id, userId] } });

    // If not, create it
    if (!userInfos) {
      const newConversation = new ConversationsModel({
        conversationType: 'private',
        membersId: [decoded.id, userId],
        membersPublicKey: [],
        links: [],
        files: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessage: '',
        lastMessageDate: new Date(),
        lastMessageAuthorId: ''
      });

      const response = await newConversation.save();
      if (!response) return { status: "error", message: "An error occurred.", data: null };

      // Create the collection for the conversation's messages
      const responses = await mongoose.connection.db.createCollection(`conversation_${response._id}`);
      if (!responses) return { status: "error", message: "An error occurred.", data: null };

      return { status: "success", message: "Conversation has been created.", data: response };
    }
    return { status: "success", message: "Conversation has been found.", data: userInfos };

  } catch (error) {
    return { status: "error", message: "An error occurred.", data: null };
  }
}

export default conversationsChoose;
