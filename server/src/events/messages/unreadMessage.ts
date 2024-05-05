import UserModel from "../../schemas/users";
import mongoose from "mongoose";

const unreadMessage = async (
  {
    conversationId,
    messageId,
  }: {
    conversationId: string;
    messageId: string;
  },
  decoded: any
) => {
  const author = await UserModel.findOne({ _id: decoded.id });
  if (!author)
    return { status: "error", messages: "Author not found.", data: null };

  await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .updateMany(
      { _id: { $gte: messageId } },
      { $pull: { viewedBy: decoded.id } }
    );

  return { status: "success", messages: "Messages marked as unread." };
};

module.exports.params = {
  authRequired: true,
};

export default unreadMessage;
