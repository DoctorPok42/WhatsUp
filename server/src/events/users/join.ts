import { verifyAuthToken } from "../../functions";
import UserModel from "../../schemas/users"
import { User } from "../../types";

const join = async ({ token }: { token: string }, socketId: string ) => {
  try {
    if (!token) return { status: "error", message: "Data not found.", data: null };

    const decoded = verifyAuthToken(token) as User | null;

    if (!decoded || !decoded.id) return { status: "error", message: "Invalid token.", data: null };

    const userInfos = await UserModel.findOne({ _id: decoded.id });

    if (!userInfos) return { status: "error", message: "User not found.", data: null };

    userInfos.socketId = socketId;
    userInfos.save();

    return { status: "success", message: "User is connected.", data: userInfos };
  } catch (error) {
    return { status: "error", message: "An error occurred.", data: null };
  }
}

export default join
