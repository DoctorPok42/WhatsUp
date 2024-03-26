import { Dashboard, User } from "./types";
import DashboardModel from "./schemas/dashboard";
import UserModel from "./schemas/users";

export const addMessageToDashboard = async (dashboard: Dashboard) => {
  dashboard.messagesSendMonth += 1;
  dashboard.lastMessageSend = new Date();
};

export const resetMessagesSendMonth = async (dashboard: Dashboard) => {
  dashboard.messagesSendMonth = 0;
};

export const addConversationToDashboard = async (dashboard: Dashboard) => {
  dashboard.conversationNumber += 1;
};

export const addContactToDashboard = async (
  dashboard: Dashboard,
  numberOfNewContacts: number = 1
) => {
  if (dashboard) {
    dashboard.contactsNumber += 1;
    dashboard.newContactsNumber += numberOfNewContacts;
    dashboard.save();
  }
};

export const removeContactFromDashboard = async (
  dashboard: Dashboard,
  numberOfNewContacts: number = 1
) => {
  if (dashboard) {
    dashboard.contactsNumber -= 1;
    dashboard.newContactsNumber -= numberOfNewContacts;
    dashboard.save();
  }
};

export const getDashboard = async (userId: string) => {
  return await DashboardModel.findOne({ userId });
};

export const createDashboard = async (userId: string) => {
  const userConversations = (await UserModel.findOne({ _id: userId })) as User;
  let conversationLength = 0;
  if (!userConversations) conversationLength = 0;
  else conversationLength = userConversations.conversationsId.length;

  const dashboard = new DashboardModel({
    userId,
    conversationNumber: conversationLength,
  });
  dashboard.save();

  return dashboard;
};

export const deleteDashboard = async (userId: string) => {
  try {
    await DashboardModel.findOneAndDelete({ userId });
    return true;
  } catch (error) {
    return null;
  }
};

const actionsFunctions = {
  addMessage: addMessageToDashboard,
  resetMessages: resetMessagesSendMonth,
  addConversation: addConversationToDashboard,
  addContact: addContactToDashboard,
  removeContact: removeContactFromDashboard,
} as const;

const dashboardActions = async (
  actionName: keyof typeof actionsFunctions,
  user: User["id"],
  ...args: any[]
) => {
  try {
    const dashboard = await DashboardModel.findOne({ userId: user._id });
    if (dashboard) {
      actionsFunctions[actionName](dashboard, ...args);
      dashboard.save();
    }
  } catch (error) {
    return null;
  }
};

export default dashboardActions;
