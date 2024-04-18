import UserModel from "../../schemas/users";
import { DecodedToken } from "../../types";
import fs from "fs";

const getFile = async (fileId: string) => {
  const path = `/srv/file_storage/${fileId}`;
  try {
    if (fs.existsSync(path)) {
      return fs.readFileSync(path);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const downloadFile = async (
  { fileId }: any,
  decoded: DecodedToken
): Promise<{
  status: string;
  message: string;
  type?: string;
  data: string | null;
}> => {
  const author = await UserModel.findOne({ _id: decoded.id });
  if (!author)
    return { status: "error", message: "Author not found.", data: null };

  const bufferFile = await Promise.resolve(getFile(fileId));
  if (!bufferFile)
    return { status: "error", message: "File not found.", data: null };

  return {
    status: "success",
    message: "Message sent.",
    type: "file",
    data: bufferFile.toString("base64"),
  };
};

module.exports.params = {
  authRequired: true,
};

export default downloadFile;
