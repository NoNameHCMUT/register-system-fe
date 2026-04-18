import { GET_USER_QUERY_KEY } from "@/shared/get-user";
import { queryClient } from "@/shared/query-client";

interface LogoutResponse {
  message?: string;
}

export const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  queryClient.removeQueries({ queryKey: GET_USER_QUERY_KEY });

  return { message: "Logged out successfully." };
};

export type { LogoutResponse };
