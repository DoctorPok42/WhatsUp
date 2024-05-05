import { DecodedToken } from "../../types";
import mongoose from "mongoose";

const addReaction = async (
  {
    conversationId,
    messageId,
    reaction,
  }: { conversationId: string; messageId: string; reaction: string },
  decoded: DecodedToken
): Promise<{ status: string; message: string; data?: any }> => {
  const realId = new mongoose.Types.ObjectId(messageId);

  // find and update the message from the conversation
  let messageToUpdate = (await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .findOne({ _id: realId })) as any;
  if (!messageToUpdate)
    return { status: "error", message: "Message not found." };

  if (!messageToUpdate.reactions) messageToUpdate.reactions = [];

  // check if the reaction already exists
  const reactionIndex = messageToUpdate.reactions.findIndex(
    (e: any) => e.value === reaction
  );
  if (reactionIndex !== -1) {
    const userIndex = messageToUpdate.reactions[reactionIndex].usersId.indexOf(
      decoded.id
    );
    if (userIndex !== -1) {
      messageToUpdate.reactions[reactionIndex].usersId.splice(userIndex, 1);

      if (messageToUpdate.reactions[reactionIndex].usersId.length === 0)
        messageToUpdate.reactions.splice(reactionIndex, 1);
    } else {
      messageToUpdate.reactions[reactionIndex].usersId.push(decoded.id);
    }
  } else {
    messageToUpdate.reactions.push({ value: reaction, usersId: [decoded.id] });
  }

  await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .updateOne(
      { _id: realId },
      { $set: { reactions: messageToUpdate.reactions } }
    );

  return {
    status: "success",
    message: "Reaction added.",
    data: { messageId, messageToUpdate },
  };
};

module.exports.params = {
  authRequired: true,
};

export default addReaction;
