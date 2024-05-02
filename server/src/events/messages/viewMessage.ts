import UserModel from "../../schemas/users";
import mongoose from "mongoose";

const viewMessage = async (
  {
    conversationId,
  }: {
    conversationId: string;
  },
  decoded: any
) => {
  const author = await UserModel.findOne({ _id: decoded.id });
  if (!author)
    return { status: "error", messages: "Author not found.", data: null };

  await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .updateMany(
      { viewedBy: { $nin: [decoded.id] } },
      { $push: { viewedBy: decoded.id } }
    );

  return { status: "success", messages: "Messages viewed." };
};

module.exports.params = {
  authRequired: true,
};

export default viewMessage;
