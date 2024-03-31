import crypto from "crypto";

export const cryptMessage = (message: string, publicKey: any): string => {
  const bufferMessage = Buffer.from(message, "utf-8");
  const encryptedMessage = crypto.publicEncrypt(publicKey, bufferMessage);
  return encryptedMessage.toString("base64");
};

export const decryptMessage = (message: string, privateKey: string) => {
  if (!message || !privateKey) return null;
  try {
    const bufferEncryptedMessage = message && Buffer.from(message, "base64");
    if (!bufferEncryptedMessage) return null;
    const decryptedMessage = crypto.privateDecrypt(
      {
        key: privateKey,
        passphrase: "",
      },
      bufferEncryptedMessage
    );
    return decryptedMessage.toString("utf-8");
  } catch (error) {
    console.log(error);
    return null;
  }
};
