import { createAuthToken } from "../functions";
import UserModel from "../schemas/users";
import { User } from "../types";
import bcrypt from 'bcrypt'

const userLogin = async ({ phone, password }: User): Promise<{ success: boolean, message: string, token: string | null }> => {
  try {
    if (!phone || !password) return { success: false, message: "Data not found.", token: null };

    const user = await UserModel.findOne({ phone });

    if (!user) return { success: false, message: "User not found.", token: null };

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return { success: false, message: "Password is incorrect.", token: null };

    const token = createAuthToken(user._id);

    if (token && isMatch) return { success: true, message: "User logged in.", token };
    else return { success: false, message: "An error occurred.", token: null };

  } catch (error) {
    return { success: false, message: "An error occurred.", token: null };
  }
}

export default userLogin;
