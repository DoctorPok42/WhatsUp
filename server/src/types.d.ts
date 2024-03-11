import mongoose from "mongoose";

interface UserOptions {
  darkMode: boolean;
  online: boolean;
  lastSeen: Date;
}

export interface User extends mongoose.Document {
  phone: string;
  password: string;
  username?: string;
  conversationsId: [];
  options: UserOptions;
  joinedAt: Date;
  publicKey: string;
  socketId: string;
}

interface ConversationsLinks {
  content: string;
  authorId: string;
  date: Date;
}

interface ConversationsFiles {
  name: string;
  data: string;
  authorsId: string;
  date: Date;
  type: "image" | "video" | "audio" | "file";
}

export interface Conversations extends mongoose.Document {
  conversationType: "private" | "group";
  name?: string;
  links: ConversationsLinks[];
  files: ConversationsFiles[];
  pinnedMessages: string[];
  membersId: string[];
  membersPublicKey: {
    key: string;
    userId: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  lastMessage: string;
  lastMessageDate: Date;
  lastMessageAuthorId: string;
}

interface MessageOptions {
  isLink: boolean;
  isFile: boolean;
  data?: string;
}

export interface Message extends mongoose.Document {
  content: string;
  authorId: string;
  date: Date;
  options: MessageOptions;
  reactions: {
    value: string;
    usersId: string[];
  }[];
}

export interface PrivateKey extends mongoose.Document {
  userId: string;
  key: string;
  createdAt: Date;
}

export interface Dashboard extends mongoose.Document {
  userId: string;
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
