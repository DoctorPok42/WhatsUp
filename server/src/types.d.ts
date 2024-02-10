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
  userLogin: (phone: string, password: string) => Promise<{ success: boolean, message: string }>;
}
