import { decryptMessages } from "../../functions";
import mongoose from "mongoose";
import { Message } from "../../types";

const searchMessage = async ({
  conversationId,
  message,
}: {
  conversationId: string;
  message: string;
}) => {
  let selectedMessages = [] as Message[];
  let decryptedMessages = [] as any[];
  let conversationKey = null;

  while (selectedMessages.length < 5) {
    let messages = (await mongoose.connection.db
      .collection(`conversation_${conversationId}`)
      .find()
      .limit(5)
      .skip(selectedMessages.length)
      .toArray()) as any;
    if (!messages) break;

    // Decrypt messages
    if (!conversationKey) {
      const realPrivateKeysId = new mongoose.Types.ObjectId(conversationId);
      conversationKey = await mongoose.connection.db
        .collection("privateKeys")
        .findOne({ conversationId: realPrivateKeysId });
      if (!conversationKey) break;
    }

    decryptedMessages = decryptMessages(messages, conversationKey.key);

    decryptedMessages.forEach((m: Message) => {
      const regex = new RegExp(message, "i");
      if (regex.test(m.content)) {
        selectedMessages.push(m);
      }
    });

    if (selectedMessages.length) break;
  }

  return {
    status: "success",
    message: "Messages found.",
    data: selectedMessages,
  };
};

module.exports.params = {
  authRequired: true,
};

export default searchMessage;
