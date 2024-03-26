import { DecodedToken } from "../../types";
import { deleteDashboard } from "../../userDashboard";

const deleteUserDashboard = async (
  {},
  decoded: DecodedToken
): Promise<{ status: string; message: string }> => {
  const deleteDashboardUser = await deleteDashboard(decoded.id);
  if (!deleteDashboardUser) {
    return {
      status: "error",
      message: "Dashboard not found.",
    };
  }

  return {
    status: "success",
    message: "Dashboard deleted successfully.",
  };
};

module.exports.params = {
  authRequired: true,
};

export default deleteUserDashboard;
