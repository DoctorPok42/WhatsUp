import UserModel from "../schemas/users";
import { User } from "../types";

const event = async (phone: User["phone"], password: User["password"]): Promise<{ success: boolean, message: string }> => {
  try {
    const user = await UserModel.findOne({ phone });

    if (!user) return { success: false, message: "User not found." };

    if (user.password !== password) return { success: false, message: "Password is incorrect." };

  } catch (error) {
    console.error(error);

    return { success: false, message: "An error occurred." };
  }

  return { success: true, message: "User has been logged in." };
}

export default event;
