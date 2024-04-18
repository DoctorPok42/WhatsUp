import ConversationsModel from "../../schemas/conversations";
import UserModel from "../../schemas/users";
import { DecodedToken, Message, User } from "../../types";
import { Socket } from "socket.io";
import mongoose from "mongoose";
import dashboardActions from "../../userDashboard";
import fs from "fs";

type FileData = {
  name: string;
  type: string;
  size: number;
  buffer: string;
};

const saveFile = async (fileId: string, fileData: FileData) => {
  const path = `/srv/file_storage/${fileId}.${fileData.type.split("/")[1]}`;
  console.log("PATH", path);

  try {
    fs.writeFileSync(path, fileData.buffer);
    return path;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const detectLink = (text: string) => {
  const links = text.match(/(https?:\/\/[^\s]+)/g);
  if (!links) return { isLink: false, link: null };

  return { isLink: true, link: links };
};

const sendMessage = async (
  { conversationId, content, files }: any,
  decoded: DecodedToken
): Promise<{
  status: string;
  message: string;
  type?: string;
  data: Message | null;
}> => {
  const author = await UserModel.findOne({ _id: decoded.id });
  if (!author)
    return { status: "error", message: "Author not found.", data: null };

  const { isLink, link } = detectLink(content);

  const messageDate = new Date();

  const isFile = files ? true : false;
  let filesData = files ?? "EMPTY";
  if (filesData === "EMPTY") filesData = null;

  let fileId = "";
  if (isFile) {
    fileId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }

  const message = {
    _id: new mongoose.Types.ObjectId(),
    content,
    authorId: decoded.id,
    date: messageDate,
    options: {
      ...(isLink && { isLink: true }),
      ...(isFile && {
        isFile: true,
        data: {
          name: filesData.name,
          type: filesData.type,
          size: filesData.size,
        },
      }),
    },
  } as Message;

  const fileSavedRequest = await Promise.resolve(saveFile(fileId, filesData));
  if (!fileSavedRequest)
    return { status: "error", message: "An error occurred.", data: null };

  // Put the message in the lastMessage field of the conversation
  const conversation = await ConversationsModel.findOne({
    _id: conversationId,
  });
  if (!conversation)
    return { status: "error", message: "Conversation not found.", data: null };

  conversation.lastMessage = isFile
    ? `${author.username} sent a file`
    : content;
  conversation.lastMessageDate = messageDate;
  conversation.lastMessageAuthorId = decoded.id;
  conversation.updatedAt = messageDate;
  conversation.lastMessageId = (message._id as unknown) as string;
  if (isLink) {
    link?.forEach((element: string) => {
      conversation.links.push({
        content: element,
        authorId: decoded.id,
        date: messageDate,
      });
    });
  }
  conversation.save();

  // Insert the message in the conversation collection
  const response = await mongoose.connection.db
    .collection(`conversation_${conversationId}`)
    .insertOne(message);
  if (!response)
    return { status: "error", message: "An error occurred.", data: null };

  if (author.options.hasDashboard) dashboardActions("addMessage", author);

  // Send the message to the members of the conversation
  const io = require("../../main").io as Socket;

  const sendMessage = await Promise.all(
    conversation.membersId.map(async (memberId: string) => {
      const user = (await UserModel.findOne({ _id: memberId })) as User;
      if (!user.options.online) return;

      io.to(user.socketId).emit("message", {
        status: "success",
        conversationsId: conversationId,
        _id: message._id,
        content: message.content,
        date: message.date,
        authorId: message.authorId,
        phone: author.phone,
        type: isFile ? "file" : "text",
      } as Message & User & { status: string; type: string });
    })
  );

  await Promise.all(sendMessage);

  return {
    status: "success",
    message: "Message sent.",
    type: isFile ? "file" : "text",
    data: {
      _id: message._id,
      content: message.content,
      date: message.date,
      authorId: message.authorId,
      phone: author.phone,
    } as Message & User,
  };
};

module.exports.params = {
  authRequired: true,
};

export default sendMessage;
