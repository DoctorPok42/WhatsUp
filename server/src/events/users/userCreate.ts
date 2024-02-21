import UserModel from "../../schemas/users";
import { User } from "../../types";
import bcrypt from 'bcrypt'
import { createAuthToken } from "../../functions";

const userCreate = async (user: User): Promise<{ status: string, message: string, token: string | null }> => {
  // const salt = await bcrypt.genSalt(10);
  // user.password = await bcrypt.hash(user.password, salt);

  const newUser = new UserModel({
    phone: user.phone,
    username: user.username || user.phone,
    // password: user.password,
    options: user.options,
    joinedAt: user.joinedAt
  });

  try {
    const response = await newUser.save();

    console.log(`👤 User ${response.phone} has been registered.`);

    const token = createAuthToken(response._id);

    if (token) return { status: "success", message: "User has been registered.", token };
    else return { status: "success", message: "An error occurred.", token: null };

  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return { status: "error", message: "Phone number is already registered.", token: null };
    } else return { status: "error", message: "An error occurred.", token: null };

  }
};

export default userCreate;
