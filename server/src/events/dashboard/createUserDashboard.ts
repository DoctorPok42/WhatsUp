import { DecodedToken } from "../../types";
import { createDashboard } from "../../userDashboard";

const createUserDashboard = async (
  {},
  decoded: DecodedToken
): Promise<{ status: string; message: string; data: any }> => {
  const createDashboardUser = (await createDashboard(decoded.id)) as any;
  if (!createDashboardUser)
    return { status: "error", message: "Dashboard not created.", data: null };

  return {
    status: "success",
    message: "Dashboard found.",
    data: createDashboardUser,
  };
};

module.exports.params = {
  authRequired: true,
};

export default createUserDashboard;
