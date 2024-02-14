import { verifyAuthToken } from "../../functions";
import ConversationsModel from "../../schemas/conversations";
import MessageModel from "../../schemas/message";
import UserModel from "../../schemas/users";
import { Message, User } from "../../types";
import { Socket } from "socket.io";
import mongoose from "mongoose";

const sendMessage = async ({ token, conversationId, content }: any): Promise<{ status: string, message: string, data: Message | null }> => {
  try {
    if (!token) return { status: "error", message: "Data not found.", data: null };
    const decoded = verifyAuthToken(token) as User | null;
    if (!decoded || !decoded.id) return { status: "error", message: "Invalid token.", data: null };

    const author = await UserModel.findOne({ _id: decoded.id });
    if (!author) return { status: "error", message: "Author not found.", data: null };

    const message = new MessageModel({
      content,
      authorId: decoded.id,
      date: new Date(),
    });

    // Put the message in the lastMessage field of the conversation
    const conversation = await ConversationsModel.findOne({ _id: conversationId });
    if (!conversation) return { status: "error", message: "Conversation not found.", data: null };

    conversation.lastMessage = content;
    conversation.lastMessageDate = new Date();
    conversation.lastMessageAuthorId = decoded.id;
    conversation.save();

    // Insert the message in the conversation collection
    const response = await mongoose.connection.db.collection(`conversation_${conversationId}`).insertOne(message);
    if (!response) return { status: "error", message: "An error occurred.", data: null };

    // Send the message to the members of the conversation
    const io = require("../../main").io as Socket;

    await Promise.all(conversation.membersId.map(async (memberId: string) => {
      const user = await UserModel.findOne({ _id: memberId }) as User;

      if (!user.options.online) return;

      io.to(user.socketId).emit("message", {
        content: message.content,
        date: message.date,
        authorId: message.authorId,
        phone: author.phone
      } as Message & User);

      return user;
    }));

    return { status: "success", message: "Message sent.", data: {
      content: message.content,
      date: message.date,
      authorId: message.authorId,
      phone: author.phone
    } as Message & User };

  } catch (error) {
    return { status: "error", message: "An error occurred.", data: null };
  }
};

export default sendMessage;
