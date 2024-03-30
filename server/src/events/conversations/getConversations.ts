import mongoose from "mongoose";
import ConversationsModel from "../../schemas/conversations";
import UserModel from "../../schemas/users";
import { Conversations, DecodedToken, User } from "../../types";
import urlMetadata from "url-metadata";

const getConversations = async (
  {},
  decoded: DecodedToken
): Promise<{
  status: string;
  message: string;
  data: Conversations[] | null;
}> => {
  const realUserId = new mongoose.Types.ObjectId(decoded.id);
  const user = await UserModel.findOne({ _id: realUserId });
  if (!user)
    return { status: "error", message: "Conversations not found.", data: null };

  const userConversations = user.conversationsId as User["conversationsId"];
  let conversationsList = [] as any[];

  // Get the conversations
  conversationsList = await Promise.all(
    userConversations.map(async (e) => {
      if (typeof e === "string") return null;
      const realId = new mongoose.Types.ObjectId(e.conversationId);
      const conversation = await ConversationsModel.findOne({ _id: realId });
      return conversation;
    })
  );

  conversationsList = conversationsList.filter(Boolean);

  if (!conversationsList)
    return { status: "error", message: "Conversations not found.", data: null };

  let memberId = [] as any[];

  // Get the members of each conversation
  conversationsList.forEach((e: Conversations) => {
    if (!e || !e.membersId) return;
    memberId.push(...e.membersId.filter((e: any) => e !== decoded.id));
  });

  // Get the name of each member
  let allName = (await UserModel.find(
    { _id: { $in: memberId } },
    { phone: 1 }
  )) as any;

  if (!allName)
    return { status: "error", message: "Users not found.", data: null };

  allName = allName.filter((e: any) => e.phone);

  // Get the name of each conversation
  let conversationsWithNames = await conversationsList.map((e: any) => {
    if (!e || !e.membersId) return e;
    let name = e.membersId
      .filter((e: any) => e !== decoded.id)
      .map((e: any) => allName.find((n: any) => n._id == e)?.phone);
    return { ...e._doc, name: name[0] || null };
  });

  // Get the unread messages
  conversationsWithNames = (await Promise.all(
    conversationsWithNames.map(async (conv: Conversations) => {
      const lastMessageId = conv.lastMessageId;
      const rightConversation = user.conversationsId.find((e: any) => {
        if (typeof e === "string") return false;
        if (e.conversationId.toString() === conv._id.toString()) return conv;
      });
      if (!rightConversation) return conv;

      if (rightConversation.lastMessageSeen === lastMessageId) {
        return { ...conv, unreadMessages: 0 };
      } else {
        if (
          !rightConversation.lastMessageSeen ||
          rightConversation.lastMessageSeen === ""
        ) {
          return { ...conv, unreadMessages: 0 };
        }
        const realId = new mongoose.Types.ObjectId(
          rightConversation.lastMessageSeen
        );
        // count the number of message after the last message seen
        const unreadMessages = await mongoose.connection.db
          .collection(`conversation_${rightConversation.conversationId}`)
          .countDocuments({ _id: { $gt: realId } });
        return { ...conv, unreadMessages };
      }
    })
  )) as any;

  // Get the metadata of each link
  const conversationsWithMetadata = await Promise.all(
    conversationsWithNames.map(async (conv: any) => {
      let links = await Promise.all(
        conv.links.map(async (link: any) => {
          try {
            if (!link.content) return { ...link, title: "" };
            const metaData = await urlMetadata(link.content);

            return { ...link, title: metaData.title };
          } catch (error) {
            console.log(error);
            return { ...link, title: "" };
          }
        })
      );
      return { ...conv, links: links };
    })
  );

  return {
    status: "success",
    message: "Conversations found.",
    data: conversationsWithMetadata,
  };
};

module.exports.params = {
  authRequired: true,
};

export default getConversations;
