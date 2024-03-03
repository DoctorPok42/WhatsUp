import { verifyAuthToken } from "../../functions";
import { Message, User } from "../../types";
import mongoose from "mongoose";

const addReaction = async ({ token, conversationId, messageId, reaction }: { token: string, conversationId: string, messageId: string, reaction: string }): Promise<{ status: string, message: string, data?: any }> => {
  try {
    if (!token) return { status: "error", message: "Data not found." };

    const { id } = verifyAuthToken(token) as User["id"] | null;
    if (!id) return { status: "error", message: "Invalid token." };

    const realId = new mongoose.Types.ObjectId(messageId);

    // find and update the message from the conversation
    let messageToUpdate = await mongoose.connection.db.collection(`conversation_${conversationId}`).findOne({ _id: realId }) as Message | null;
    if (!messageToUpdate) return { status: "error", message: "Message not found." };

    if (!messageToUpdate.reactions) messageToUpdate.reactions = [];

    let userHasReacted = false;

    // check if the reaction already exists
    const reactionIndex = messageToUpdate.reactions.findIndex(e => e.value === reaction);
    if (reactionIndex !== -1) {
      const userIndex = messageToUpdate.reactions[reactionIndex].usersId.indexOf(id);
      if (userIndex !== -1) {
        messageToUpdate.reactions[reactionIndex].usersId.splice(userIndex, 1);

        if (messageToUpdate.reactions[reactionIndex].usersId.length === 0)
          messageToUpdate.reactions.splice(reactionIndex, 1);
      } else {
        userHasReacted = true;
        messageToUpdate.reactions[reactionIndex].usersId.push(id);
      }
    } else {
      userHasReacted = true;
      messageToUpdate.reactions.push({ value: reaction, usersId: [id] });
    }

    await mongoose.connection.db.collection(`conversation_${conversationId}`).updateOne({ _id: realId }, { $set: { reactions: messageToUpdate.reactions } });

    return { status: "success", message: "Reaction added.", data: { userHasReacted, reaction, messageId } };

  } catch (error) {
    return { status: "error", message: "An error occurred." };
  }
};

export default addReaction;
