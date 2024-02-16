import { verifyAuthToken } from "../../functions";
import UserModel from "../../schemas/users";
import { User } from "../../types";

const userSearch = async ({ token, arg }: any): Promise<{ status: string, message: string, data: { id: string, phone: string, username: string | undefined }[] | null }> => {
  try {
    if (!token) return { status: "error", message: "Data not found.", data: null };

    const decoded = verifyAuthToken(token) as User | null;
    if (!decoded || !decoded.id) return { status: "error", message: "Invalid token.", data: null };

    const userInfos = await UserModel.find({ $or: [
      { phone: { $regex: arg, $options: "i" } },
      { username: { $regex: arg, $options: "i" } }
    ] }, { phone: 1, _id: 1, username: 1 }).limit(10);

    if (!userInfos) return { status: "error", message: "User not found.", data: null };

    const users = userInfos.map((user) => ({
      id: user._id,
      phone: user.phone,
      username: user.username
    }));

    return { status: "success", message: "User has been found.", data: users };

  } catch (error) {
    return { status: "error", message: "An error occurred.", data: null };
  }
};

export default userSearch;
