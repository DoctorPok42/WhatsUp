import UserModel from "../../schemas/users";
import { DecodedToken } from "../../types";

const usersGet = async (
  {}: any,
  decoded: DecodedToken
): Promise<{ status: string; message: string; data: any }> => {
  try {
    const user = await UserModel.findOne({ _id: decoded.id });
    if (!user)
      return { status: "error", message: "Author not found.", data: null };

    return {
      status: "success",
      message: "Users have been found.",
      data: {
        _id: user._id,
        phone: user.phone,
        username: user.username,
        options: user.options,
        joinedAt: user.joinedAt,
      },
    };
  } catch (error) {
    return { status: "error", message: "An error occurred.", data: null };
  }
};

module.exports.params = {
  authRequired: true,
};

export default usersGet;
