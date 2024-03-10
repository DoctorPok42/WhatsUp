import UserModel from "../../schemas/users";
import { DecodedToken } from "../../types";

const userSearch = async (
  { arg }: { arg: string },
  decoded: DecodedToken
): Promise<{
  status: string;
  message: string;
  data: { id: string; phone: string; username: string | undefined }[] | null;
}> => {
  const userInfos = await UserModel.find(
    {
      $or: [
        { phone: { $regex: arg, $options: "i" } },
        { username: { $regex: arg, $options: "i" } },
      ],
    },
    { phone: 1, _id: 1, username: 1 }
  ).limit(10);

  if (!userInfos)
    return { status: "error", message: "User not found.", data: null };

  const users = userInfos.map((user) => ({
    id: user._id,
    phone: user.phone,
    username: user.username,
  }));

  return { status: "success", message: "User has been found.", data: users };
};

module.exports.params = {
  authRequired: true,
};

export default userSearch;
