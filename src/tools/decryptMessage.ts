const unCrypt = (data: any) => {
  const messageLoaded: any = {};
  if (!data) return messageLoaded;

  data.forEach((conversation: any) => {
    const newMessages = conversation.messages.map((message: any) => {
      if (!message.content || !conversation.privateKey) return null;

      try {
        const bufferEncryptedMessage = atob(message.content) as any;
        if (!bufferEncryptedMessage) return null;
        const crypto = require("crypto");
        const decryptedMessage = crypto.privateDecrypt(
          {
            key: conversation.privateKey,
            passphrase: "",
          },
          bufferEncryptedMessage
        );
        message.content = decryptedMessage.toString("utf-8");
      } catch (error) {
        console.error("Error decrypting message:", error);
        return null;
      }
      return { ...message, content: message.content };
    });
    messageLoaded[conversation.conversationId] = newMessages.reverse();
  });

  return messageLoaded;
};

export default unCrypt;
