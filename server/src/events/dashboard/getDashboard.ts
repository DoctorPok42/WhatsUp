import DashboardModel from "../../schemas/dashboard";
import { DecodedToken } from "../../types";

const getDashboard = async (
  {},
  decoded: DecodedToken
): Promise<{ status: string; message: string; data: any }> => {
  const userDashboard = await DashboardModel.findOne({ userId: decoded.id });
  if (!userDashboard)
    return { status: "error", message: "Dashboard not found.", data: null };

  return {
    status: "success",
    message: "Dashboard found.",
    data: userDashboard,
  };
};

module.exports.params = {
  authRequired: true,
};

export default getDashboard;
