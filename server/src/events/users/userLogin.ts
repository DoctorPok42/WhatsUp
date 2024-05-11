import { createAuthToken, sendMessage } from "../../functions";
import UserModel from "../../schemas/users";
import { User } from "../../types";

const userLogin = async ({
  phone,
  verifCode,
}: User): Promise<{
  status: string;
  message: string;
  token: string | null;
  userId?: string;
}> => {
  if (!phone)
    return { status: "error", message: "Data not found.", token: null };

  const user = await UserModel.findOne({ phone });
  if (!user)
    return { status: "error", message: "User not found.", token: null };

  let validCode = "";

  if (!verifCode) {
    validCode = Math.floor(1000 + Math.random() * 9000).toString();

    user.verifCode = validCode;
    await user.save();

    sendMessage(`${validCode} is your WhatsUp verification code.`, phone);
    return {
      status: "success",
      message: "Verification code sent.",
      token: null,
    };
  } else {
    if (verifCode !== user.verifCode)
      return {
        status: "error",
        message: "Invalid verification code.",
        token: null,
      };

    user.verifCode = "";
    await user.save();
  }

  const token = await createAuthToken(user._id);

  if (token)
    return {
      status: "success",
      message: "User logged in.",
      token,
    };
  else return { status: "error", message: "An error occurred.", token: null };
};

export default userLogin;
