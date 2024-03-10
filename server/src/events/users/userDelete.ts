import UserModel from "../../schemas/users";
import { User } from "../../types";

const userDelete = async (
  phone: User["phone"]
): Promise<{ status: string; message: string }> => {
  try {
    const userToDelete = await UserModel.findOneAndDelete({ phone: phone });

    if (!userToDelete) return { status: "error", message: "User not found." };

    return { status: "success", message: "User has been deleted." };
  } catch (error) {
    return { status: "error", message: "An error occurred." };
  }
};

export default userDelete;
