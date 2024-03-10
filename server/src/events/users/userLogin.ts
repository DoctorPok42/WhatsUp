import { createAuthToken } from "../../functions";
import UserModel from "../../schemas/users";
import { User } from "../../types";
import bcrypt from "bcrypt";

const userLogin = async ({
  phone,
}: User): Promise<{
  status: string;
  message: string;
  token: string | null;
  userId?: string;
}> => {
  try {
    if (!phone)
      return { status: "error", message: "Data not found.", token: null };

    const user = await UserModel.findOne({ phone });

    if (!user)
      return { status: "error", message: "User not found.", token: null };

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) return { status: "error", message: "Password is incorrect.", token: null };

    const token = createAuthToken(user._id);

    if (token)
      return {
        status: "success",
        message: "User logged in.",
        token,
        userId: user._id,
      };
    else return { status: "error", message: "An error occurred.", token: null };
  } catch (error) {
    return { status: "error", message: "An error occurred.", token: null };
  }
};

export default userLogin;
