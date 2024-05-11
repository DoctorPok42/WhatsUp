import { createAuthToken } from "../../functions";
import UserModel from "../../schemas/users";
import { DecodedToken } from "../../types";

const userUpdate = async (
  { username }: { username: string },
  decoded: DecodedToken
): Promise<{ status: string; message: string; token: string | null }> => {
  try {
    const user = await UserModel.findOne({ _id: decoded.id });
    if (!user)
      return { status: "error", message: "Author not found.", token: null };

    user.username = username;
    await user.save();

    const token = await createAuthToken(user._id);

    return { status: "success", message: "User has been updated.", token };
  } catch (error) {
    return { status: "error", message: "An error occurred.", token: null };
  }
};

module.exports.params = {
  authRequired: true,
};

export default userUpdate;
