import UserModel from "../../schemas/users";
import { User } from "../../types";
import { createAuthToken, sendMessage } from "../../functions";

const userCreate = async (
  user: User
): Promise<{ status: string; message: string; token: string | null }> => {
  const verifCode = Math.floor(1000 + Math.random() * 9000).toString();

  const newUser = new UserModel({
    phone: user.phone,
    username: user.username ?? user.phone,
    options: user.options,
    joinedAt: user.joinedAt,
    verifCode,
  });

  try {
    const response = await newUser.save();

    sendMessage(`${verifCode} is your WhatsUp verification code.`, user.phone);

    console.log(`👤 User ${response.phone} has been registered.`);

    const token = await createAuthToken(response._id);

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
