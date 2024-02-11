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
  options: UserOptions;
  joinedAt: Date;
}

export interface Events {
  userCreate: (user: User) => Promise<{ success: boolean, message: string }>;
  userDelete: ({ token }: string) => Promise<{ success: boolean, message: string }>;
  userLogin: ({ phone, password }: User) => Promise<{ success: boolean, message: string }>;
  userUpdate: (phone: string, user: User) => Promise<{ success: boolean, message: string }>;
  userGet: ({ token }: string) => Promise<{ success: boolean, message: string, data: User | null }>;
  usersGet: (phone: string[]) => Promise<{ success: boolean, message: string, data: User[] | null }>;
}
