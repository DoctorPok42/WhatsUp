import UserModel from "../schemas/users";
import { User } from "../types";

const event = async (user: User): Promise<{ status: string, message: string }> => {
  const newUser = new UserModel({
    phone: user.phone,
    password: user.password,
    options: user.options,
    joinedAt: user.joinedAt
  });

  try {
    const response = await newUser.save();

    console.log(`👤 User ${response.phone} has been registered.`);
    return { status: "success", message: "User has been registered." };

  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return { status: "error", message: "Phone number is already registered." };
    } else return { status: "error", message: "An error occurred." };

  }
};

export default event;
