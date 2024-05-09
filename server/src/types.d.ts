import mongoose from "mongoose";

interface UserOptions {
  darkMode: boolean;
  online: boolean;
  lastSeen: Date;
  hasDashboard: boolean;
}

export interface User extends mongoose.Document {
  phone: string;
  password: string;
  username?: string;
  conversationsId: {
    conversationId: string;
    lastMessageSeen: string;
  }[];
  options: UserOptions;
  joinedAt: Date;
  publicKey: string;
  socketId: string;
  verifCode: string;
}

interface ConversationsLinks {
  content: string;
  authorId: string;
  date: Date;
}

interface ConversationsFiles {
  id: string;
  name: string;
  authorsId: string;
  date: Date;
  type: string;
  content?: string;
}

export interface Conversations extends mongoose.Document {
  conversationType: "private" | "group";
  name?: string;
  links: ConversationsLinks[];
  files: ConversationsFiles[];
  pinnedMessages: string[];
  membersId: string[];
  publicKey: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage: string;
  lastMessageDate: Date;
  lastMessageAuthorId: string;
  lastMessageId: string;
}

interface MessageOptions {
  isLink: boolean;
  isFile: boolean;
  data?: {
    name: string;
    size: number;
    type: "image" | "video" | "audio" | "file";
    id: string;
  };
}

export interface Message extends mongoose.Document {
  content: string;
  authorId: string;
  date: Date;
  img: string;
  options: MessageOptions;
  reactions:
    | {
        value: string;
        usersId: string[];
      }[]
    | [];
  viewedBy: string[];
}

export interface PrivateKey extends mongoose.Document {
  conversationId: string;
  key: string;
  createdAt: Date;
}

export interface Dashboard extends mongoose.Document {
  userId: string;
  messagesSendMonth: number;
  conversationNumber: number;
  lastMessageSend: Date;
  contactsNumber: number;
  newContactsNumber: number;
}

export interface Events {
  userCreate: (user: User) => Promise<{ success: boolean; message: string }>;
  userDelete: ({
    token,
  }: string) => Promise<{ success: boolean; message: string }>;
  userLogin: ({
    phone,
    password,
  }: User) => Promise<{ success: boolean; message: string }>;
  userUpdate: (
    phone: string,
    user: User
  ) => Promise<{ success: boolean; message: string }>;
  userGet: ({
    token,
  }: string) => Promise<{
    success: boolean;
    message: string;
    data: User | null;
  }>;
  usersGet: (
    phone: string[]
  ) => Promise<{ success: boolean; message: string; data: User[] | null }>;
}

export interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}
