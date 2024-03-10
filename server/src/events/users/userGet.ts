import UserModel from "../../schemas/users";
import { DecodedToken, User } from "../../types";

const userGet = async (
  {},
  decoded: DecodedToken
): Promise<{ status: string; message: string; data: User | null }> => {
  const userInfos = await UserModel.findOne({ _id: decoded.id });

  if (!userInfos)
    return { status: "error", message: "User not found.", data: null };

  return {
    status: "success",
    message: "User has been found.",
    data: userInfos,
  };
};

module.exports.params = {
  authRequired: true,
};

export default userGet;
