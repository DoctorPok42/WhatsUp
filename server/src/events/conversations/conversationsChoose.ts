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

  const firstUser = await UserModel.findById(decoded.id);
  const secondUser = await UserModel.findById(userId);
  if (!firstUser || !secondUser)
    return { status: "error", message: "An error occurred.", data: null };

  // If not, create it
  if (!userInfos || userInfos.conversationType !== "private") {
    const creationDate = new Date();
    const newConversation = new ConversationsModel({
      _id: new mongoose.Types.ObjectId(),
      conversationType: "private",
      membersId: [decoded.id, userId],
      membersPublicKey: [firstUser.publicKey, secondUser.publicKey],
      links: [],
      files: [],
      createdAt: creationDate,
      updatedAt: creationDate,
      lastMessage: "",
      lastMessageDate: creationDate,
      lastMessageAuthorId: "",
    }) as Conversations;

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
    const conversationId = response._id as never;
    firstUser.conversationsId.push(conversationId);
    secondUser.conversationsId.push(conversationId);

    await firstUser.save();
    await secondUser.save();

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
