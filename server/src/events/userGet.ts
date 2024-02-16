import { verifyAuthToken } from "../functions";
import UserModel from "../schemas/users";
import { User } from "../types";

const userGet = async ({ token }: any): Promise<{ status: string, message: string, data: User | null }> => {
  try {
    if (!token) return { status: "error", message: "Data not found.", data: null };

    const decoded = verifyAuthToken(token) as User | null;

    if (!decoded || !decoded.id) return { status: "error", message: "Invalid token.", data: null };

    const userInfos = await UserModel.findOne({ _id: decoded.id });

    if (!userInfos) return { status: "error", message: "User not found.", data: null };

    return { status: "success", message: "User has been found.", data: userInfos };

  } catch (error) {
    return { status: "error", message: "An error occurred.", data: null };
  }
};

export default userGet;
