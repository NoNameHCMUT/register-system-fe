import axiosClient, { globalConfig } from "@/shared/api";

const LOGOUT_ENDPOINT = "/auth/logout";

interface LogoutResponse {
  message?: string;
}

const logoutApi = async (): Promise<LogoutResponse> => {
  const response = await axiosClient.post<LogoutResponse>(
    `${globalConfig}${LOGOUT_ENDPOINT}`,
  );
  return response.data;
};

export type { LogoutResponse };
export { logoutApi };