import UserModel from "../../schemas/users";
import { DecodedToken } from "../../types";

const join = async (decoded: DecodedToken, socketId: string) => {
  const userInfos = await UserModel.findOne({ _id: decoded.id });
  if (!userInfos)
    return { status: "error", message: "User not found.", data: null };

  userInfos.socketId = socketId;
  userInfos.save();

  return { status: "success", message: "User is connected.", data: userInfos };
};

module.exports.params = {
  authRequired: true,
};

export default join;
