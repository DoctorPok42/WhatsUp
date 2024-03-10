import ConversationsModel from "../../schemas/conversations";
import UserModel from "../../schemas/users";
import { Conversations, DecodedToken, User } from "../../types";
import mongoose from "mongoose";

const conversationsChoose = async (
  { userId }: User["id"],
  decoded: DecodedToken
): Promise<{ status: string; message: string; data: Conversations | null }> => {
  // Check if the conversation already exists (check in both ways, to avoid duplicates)
  const userInfos = await ConversationsModel.findOne({
    membersId: { $all: [decoded.id, userId] },
  });

  // If not, create it
  if (!userInfos || userInfos.conversationType !== "private") {
    const newConversation = new ConversationsModel({
      conversationType: "private",
      membersId: [decoded.id, userId],
      membersPublicKey: [],
      links: [],
      files: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessage: "",
      lastMessageDate: new Date(),
      lastMessageAuthorId: "",
    });

    const response = await newConversation.save();
    if (!response)
      return { status: "error", message: "An error occurred.", data: null };

    // Create the collection for the conversation's messages
    const responses = await mongoose.connection.db.createCollection(
      `conversation_${response._id}`
    );
    if (!responses)
      return { status: "error", message: "An error occurred.", data: null };

    // Add the conversation id to the user's conversations list
    const firstUser = await UserModel.findByIdAndUpdate(decoded.id, {
      $push: { conversationsId: response._id },
    });
    const Seconduser2 = await UserModel.findByIdAndUpdate(userId, {
      $push: { conversationsId: response._id },
    });

    if (!firstUser || !Seconduser2)
      return { status: "error", message: "An error occurred.", data: null };

    return {
      status: "success",
      message: "Conversation has been created.",
      data: response,
    };
  }
  return {
    status: "success",
    message: "Conversation has been found.",
    data: userInfos,
  };
};

module.exports.params = {
  authRequired: true,
};

export default conversationsChoose;
