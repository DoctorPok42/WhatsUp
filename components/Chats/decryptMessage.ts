import { decryptMessage } from "@/tools/cryptMessage";

const unCrypt = (messages: [], privateKey: string) => {
  try {
    const decryptedMessages = messages.map((message: any) => {
      const decryptedMessage = decryptMessage(message.content, privateKey);
      return { ...message, content: decryptedMessage };
    });
    return decryptedMessages;
  } catch (error) {
    return [];
  }
};

export default unCrypt;
