import ConversationsModel from "../../schemas/conversations";

const pinMessage = async ({
  conversationId,
  messageId,
}: {
  conversationId: string;
  messageId: string;
}): Promise<{ status: string; message: string; data?: any }> => {
  const conversation = await ConversationsModel.findOne({
    _id: conversationId,
  });
  if (!conversation)
    return { status: "error", message: "Conversation not found." };

  // check if the message is already pinned
  const isPinned = conversation.pinnedMessages.includes(messageId);
  if (isPinned) {
    await ConversationsModel.updateOne(
      { _id: conversationId },
      { $pull: { pinnedMessages: messageId } }
    );
    return {
      status: "success",
      message: "Message unpinned.",
      data: conversation.pinnedMessages.filter(
        (id: string) => id !== messageId
      ),
    };
  } else {
    await ConversationsModel.updateOne(
      { _id: conversationId },
      { $push: { pinnedMessages: messageId } }
    );
    return {
      status: "success",
      message: "Message pinned.",
      data: conversation.pinnedMessages.concat(messageId),
    };
  }
};

module.exports.params = {
  authRequired: true,
};

export default pinMessage;
