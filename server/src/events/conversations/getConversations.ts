import ConversationsModel from "../../schemas/conversations";
import UserModel from "../../schemas/users";
import { Conversations, DecodedToken } from "../../types";
import urlMetadata from "url-metadata";

const getConversations = async (
  {},
  decoded: DecodedToken
): Promise<{
  status: string;
  message: string;
  data: Conversations[] | null;
}> => {
  const conversationsListId = await UserModel.findOne(
    { _id: decoded.id },
    { conversationsId: 1 }
  );
  if (!conversationsListId)
    return { status: "error", message: "Conversations not found.", data: null };

  let conversationsList = await ConversationsModel.find({
    _id: { $in: conversationsListId.conversationsId },
  });
  if (!conversationsList)
    return { status: "error", message: "Conversations not found.", data: null };

  const memberId = conversationsList
    .map((e: any) => e.membersId.filter((e: any) => e !== decoded.id))
    .flat(1);
  let allName = (await UserModel.find(
    { _id: { $in: memberId } },
    { phone: 1 }
  )) as any;
  if (!allName)
    return { status: "error", message: "Users not found.", data: null };

  allName = allName.filter((e: any) => e.phone);

  const conversationsWithNames = await conversationsList.map((e: any) => {
    let name = e.membersId
      .filter((e: any) => e !== decoded.id)
      .map((e: any) => allName.find((n: any) => n._id == e)?.phone);
    return { ...e._doc, name: name[0] || null };
  });

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
