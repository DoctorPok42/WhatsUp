import UserModel from "../../schemas/users";
import { User } from "../../types";

const userUpdate = async (
  phone: User["phone"],
  user: User
): Promise<{ status: string; message: string }> => {
  try {
    const userToUpdate = await UserModel.findOneAndUpdate(
      { phone: phone },
      user
    );

    if (!userToUpdate) return { status: "error", message: "User not found." };

    return { status: "success", message: "User has been updated." };
  } catch (error) {
    return { status: "error", message: "An error occurred." };
  }
};

export default userUpdate;
