import UserModel from "../../schemas/users";
import mongoose from "mongoose";

const searchMessage = async ({
  conversationId,
  message,
}: {
  conversationId: string;
  message: string;
}) => {
  const messages = await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .find({ content: new RegExp(message, "i") })
    .limit(5)
    .toArray();

  // add username to messages
  for (let i = 0; i < messages.length; i++) {
    const user = await UserModel.findById(messages[i].authorId);
    if (!user) return { status: "error", message: "User not found." };
    messages[i].username = user.username;
  }

  return { status: "success", message: "Messages found.", data: messages };
};

module.exports.params = {
  authRequired: true,
};

export default searchMessage;
