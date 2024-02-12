import { createAuthToken } from "../../functions";
import UserModel from "../../schemas/users";
import { User } from "../../types";
import bcrypt from 'bcrypt'

const userLogin = async ({ phone, password }: User): Promise<{ status: string, message: string, token: string | null }> => {
  try {
    if (!phone || !password) return { status: "error", message: "Data not found.", token: null };

    const user = await UserModel.findOne({ phone });

    if (!user) return { status: "error", message: "User not found.", token: null };

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return { status: "error", message: "Password is incorrect.", token: null };

    const token = createAuthToken(user._id);

    if (token && isMatch) return { status: "success", message: "User logged in.", token };
    else return { status: "error", message: "An error occurred.", token: null };

  } catch (error) {
    return { status: "error", message: "An error occurred.", token: null };
  }
}

export default userLogin;
