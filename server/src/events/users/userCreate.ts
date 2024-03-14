import UserModel from "../../schemas/users";
import { User } from "../../types";
import { createAuthToken, sendMessage } from "../../functions";
import crypto from "crypto";
import mongoose from "mongoose";

export const genereateKey = async (): Promise<{
  publicKey: string;
  privateKey: string;
}> => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  return Promise.resolve({ publicKey, privateKey });
};

const userCreate = async (
  user: User
): Promise<{ status: string; message: string; token: string | null }> => {
  const { publicKey, privateKey } = await genereateKey();

  const verifCode = Math.floor(1000 + Math.random() * 9000).toString();

  const newUser = new UserModel({
    phone: user.phone,
    username: user.username || user.phone,
    options: user.options,
    joinedAt: user.joinedAt,
    publicKey,
    verifCode,
  });

  const userKeys = {
    userId: newUser._id,
    privateKey,
  };

  try {
    const response = await newUser.save();

    const userKeysResponse = await mongoose.connection.db
      .collection("privateKeys")
      .insertOne(userKeys);
    if (!userKeysResponse)
      return { status: "error", message: "An error occurred.", token: null };

    sendMessage(`${verifCode} is your WhatsUp verification code.`, user.phone);

    console.log(`👤 User ${response.phone} has been registered.`);

    const token = createAuthToken(response._id);

    if (token)
      return { status: "success", message: "User has been registered.", token };
    else
      return { status: "success", message: "An error occurred.", token: null };
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return {
        status: "error",
        message: "Phone number is already registered.",
        token: null,
      };
    } else
      return { status: "error", message: "An error occurred.", token: null };
  }
};

export default userCreate;
