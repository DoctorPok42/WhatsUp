import UserModel from "../../schemas/users";
import { User } from "../../types";
import { createAuthToken } from "../../functions";
import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose from "mongoose";

const genereateKey = (): Promise<{ publicKey: string; privateKey: string }> => {
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
  // const salt = await bcrypt.genSalt(10);
  // user.password = await bcrypt.hash(user.password, salt);

  const { publicKey, privateKey } = await genereateKey();

  const salt = await bcrypt.genSalt(10);
  const hashedPrivateKey = await bcrypt.hash(privateKey, salt);

  const newUser = new UserModel({
    phone: user.phone,
    username: user.username || user.phone,
    // password: user.password,
    options: user.options,
    joinedAt: user.joinedAt,
    publicKey,
  });

  const userKeys = {
    userId: newUser._id,
    privateKey: hashedPrivateKey,
  };

  try {
    const response = await newUser.save();

    const userKeysResponse = await mongoose.connection.db
      .collection("privateKeys")
      .insertOne(userKeys);
    if (!userKeysResponse)
      return { status: "error", message: "An error occurred.", token: null };

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
