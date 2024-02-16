import UserModel from "../schemas/users";
import { User } from "../types";

const usersGet = async (phone: User["phone"][]): Promise<{ status: string, message: string, data: User[] | null }> => {
  try {
    const usersInfos = await UserModel.find({ phone: { $in: phone } });

    if (!usersInfos) return { status: "error", message: "Users not found.", data: null };

    return { status: "success", message: "Users have been found.", data: usersInfos };

  } catch (error) {
    return { status: "error", message: "An error occurred.", data: null };
  }
};

export default usersGet;
