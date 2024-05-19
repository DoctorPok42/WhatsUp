import mongoose from "mongoose";
import ConversationsModel from "../../schemas/conversations";
import UserModel from "../../schemas/users";
import { Conversations, DecodedToken, User } from "../../types";
import urlMetadata from "url-metadata";

type Response = {
  status: string;
  message: string;
  data: Conversations[] | null;
};

const getConversations = async (
  {},
  decoded: DecodedToken
): Promise<Response> => {
  const realUserId = new mongoose.Types.ObjectId(decoded.id);
  const user = await UserModel.findOne({ _id: realUserId });
  if (!user)
    return { status: "error", message: "Conversations not found.", data: null };

  const userConversations = user.conversationsId as User["conversationsId"];
  let conversationsList: any[];

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
    { username: 1 }
  )) as any;

  if (!allName)
    return { status: "error", message: "Users not found.", data: null };

  allName = allName.filter((e: any) => e.username);

  // Get the name of each conversation
  let conversationsWithNames = conversationsList.map((e: any) => {
    if (!e || !e.membersId) return e;
    let name = e.membersId
      .filter((e: any) => e !== decoded.id)
      .map((e: any) => allName.find((n: any) => n._id == e)?.username);
    return { ...e._doc, name: name[0] || null };
  });

  // Get the unread messages
  conversationsWithNames = (await Promise.all(
    conversationsWithNames.map(async (conv: Conversations) => {
      const messagesConversation = await mongoose.connection.db
        .collection(`conversation_${conv._id}`)
        .find()
        .toArray();
      if (!messagesConversation) return conv;

      const unreadMessages = messagesConversation.filter(
        (message: any) => !message.viewedBy?.includes(decoded.id)
      ).length;
      return { ...conv, unreadMessages };
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

      // get the conversation private key
      const realPrivateKeysId = new mongoose.Types.ObjectId(conv._id);
      const conversationKey = await mongoose.connection.db
        .collection("privateKeys")
        .findOne({ conversationId: realPrivateKeysId });
      if (!conversationKey) return { ...conv, links: links };
      return { ...conv, links: links, key: conversationKey.key };
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
