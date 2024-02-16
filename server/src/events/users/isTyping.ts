import { Socket } from 'socket.io';
import { verifyAuthToken } from '../../functions';
import UserModel from '../../schemas/users';
import { User } from '../../types';
import ConversationsModel from '../../schemas/conversations';

const isTyping = async ({ token, conversationId }: { token: string, conversationId: string }) => {
  try {
    if (!token) return { status: "error", message: "Data not found." };
    const decoded = verifyAuthToken(token) as User | null;
    if (!decoded || !decoded.id) return { status: "error", message: "Invalid token." };

    const author = await UserModel.findOne({ _id: decoded.id });
    if (!author) return { status: "error", message: "Author not found." };

    const conversation = await ConversationsModel.findOne({ _id: conversationId });
    if (!conversation) return { status: "error", message: "Conversation not found." };

    const io = require('../../main').io as Socket;

    await Promise.all(conversation.membersId.map(async (memberId) => {
      if (memberId === decoded.id) return;
      const user = await UserModel.findOne({ _id: memberId }) as User;
      if (!user.options.online) return;
      io.to(user.socketId).emit('isTypingUser', author.phone);
    }))

    return { status: "success", message: "Typing status sent." };

  } catch (error) {
    return { status: "error", message: "An error occurred." };
  }
}

export default isTyping;
