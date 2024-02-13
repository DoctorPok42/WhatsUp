import { verifyAuthToken } from "../../functions";
import ConversationsModel from "../../schemas/conversations";
import UserModel from "../../schemas/users";
import { Conversations, User } from "../../types";

const getConversations = async ({ token }: any): Promise<{ status: string, message: string, data: Conversations[] | null }> => {
  try {
    if (!token) return { status: "error", message: "Data not found.", data: null };

    const decoded = verifyAuthToken(token) as User | null;

    if (!decoded || !decoded.id) return { status: "error", message: "Invalid token.", data: null };

    const conversationsListId = await UserModel.findOne({ _id: decoded.id }, { conversationsId: 1 });
    if (!conversationsListId) return { status: "error", message: "Conversations not found.", data: null };

    let conversationsList = await ConversationsModel.find({ _id: { $in: conversationsListId.conversationsId } });
    if (!conversationsList) return { status: "error", message: "Conversations not found.", data: null };

    const memberId = conversationsList.map((e: any) => e.membersId.filter((e: any) => e !== decoded.id)).flat(1);
    let allName = await UserModel.find({ _id: { $in: memberId } }, { phone: 1 }) as any;
    if (!allName) return { status: "error", message: "Users not found.", data: null };

    allName = allName.filter((e: any) => e.phone);

    const conversationsWithNames = conversationsList.map((e: any) => {
      let name = e.membersId.filter((e: any) => e !== decoded.id).map((e: any) => allName.find((n: any) => n._id == e)?.phone);
      return { ...e._doc, name: name[0] || null };
    });

    return { status: "success", message: "Conversations found.", data: conversationsWithNames };

  } catch (error) {
    return { status: "error", message: "An error occurred.", data: null };
  }
};

export default getConversations;
