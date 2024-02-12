import mongoose from "mongoose"

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
}

interface ConversationsLinks {
  content: string,
  authorsId: string,
  date: Date
}

interface ConversationsFiles {
  name: string,
  data: string,
  authorsId: string,
  date: Date
}

export interface Conversations extends mongoose.Document {
  conversationType: 'private' | 'group';
  name?: string;
  links: ConversationsLinks[];
  files: ConversationsFiles[];
  membersId: string[];
  membersPublicKey: {
    key: string,
    userId: string
  }[];
  createdAt: Date;
  updatedAt: Date;
  lastMessage: string;
  lastMessageDate: Date;
  lastMessageAuthorId: string;
}

export interface Events {
  userCreate: (user: User) => Promise<{ success: boolean, message: string }>;
  userDelete: ({ token }: string) => Promise<{ success: boolean, message: string }>;
  userLogin: ({ phone, password }: User) => Promise<{ success: boolean, message: string }>;
  userUpdate: (phone: string, user: User) => Promise<{ success: boolean, message: string }>;
  userGet: ({ token }: string) => Promise<{ success: boolean, message: string, data: User | null }>;
  usersGet: (phone: string[]) => Promise<{ success: boolean, message: string, data: User[] | null }>;
}
