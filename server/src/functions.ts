import chalk from "chalk";
import jwt from "jsonwebtoken";
import UserModel from "./schemas/users";
import ConversationsModel from "./schemas/conversations";
import DashboardModel from "./schemas/dashboard";
import { Message, User } from "./types";
import { createDashboard, deleteDashboard } from "./userDashboard";
import crypto from "crypto";

const themeColors = {
  text: "#2B2",
  variable: "#42f5e0",
  error: "#f5426c",
} as any;

export const getThemeColor = (color: any) =>
  Number(`0x${themeColors[color].substring(1)}`);

export const color = (color: any, message: any) => {
  return chalk.hex(themeColors[color])(message);
};

export const createAuthToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });
};

export const verifyAuthToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

export const checkAuthToken = (token: string) => {
  if (!token) return null;

  const decoded = verifyAuthToken(token) as any;
  if (!decoded || !decoded.id) return null;

  return decoded;
};

export const decryptMessages = (messages: any[], privateKey: string) => {
  const decryptedMessages = messages.map((message: Message) => {
    if (!message || !privateKey) return null;

    if (message.options.isFile) return message;

    try {
      const bufferEncryptedMessage =
        message && Buffer.from(message.content, "base64");
      if (!bufferEncryptedMessage) return null;
      const decryptedMessage = crypto.privateDecrypt(
        {
          key: privateKey,
          passphrase: "",
        },
        bufferEncryptedMessage
      );
      message.content = decryptedMessage.toString("utf-8");
    } catch (error) {
      return null;
    }
    return message;
  });

  return decryptedMessages;
};

export const checkCollections = () => {
  UserModel.find({}, (err: any, res: any) => {
    if (err) console.error(err);
    if (res)
      console.log(
        color("text", `📦 ${color("variable", res.length)} users found.`)
      );
  });

  ConversationsModel.find({}, (err: any, res: any) => {
    if (err) console.error(err);
    if (res)
      console.log(
        color(
          "text",
          `📦 ${color("variable", res.length)} conversations found.`
        )
      );
  });

  // if user has dashboard but no dashboard document is found, create one
  UserModel.find({ "options.hasDashboard": true }, (err: any, res: any) => {
    if (err) console.error(err);
    if (res) {
      res.forEach((user: User) => {
        DashboardModel.findOne({ userId: user._id }, (err: any, res: any) => {
          if (err) console.error(err);
          if (!res) createDashboard(user._id);
        });
      });
    }
  });

  // and if user has no dashboard but a dashboard document is found, delete it
  UserModel.find({ "options.hasDashboard": false }, (err: any, res: any) => {
    if (err) console.error(err);
    if (res) {
      res.forEach((user: User) => deleteDashboard(user._id));
    }
  });

  DashboardModel.find({}, (err: any, res: any) => {
    if (err) console.error(err);
    if (res)
      console.log(
        color("text", `📦 ${color("variable", res.length)} dashboards found.`)
      );
  });
};

export const sendMessage = (message: string, to: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  client.messages
    .create({
      sender: "WhatsUp",
      body: message,
      from: "WhatsUp",
      to: "+33" + to.replace(/\s/g, ""),
    })
    .then((message: any) => console.log(message.sid));
};
