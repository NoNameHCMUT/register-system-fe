interface LogoutResponse {
  message?: string;
}

const logoutApi = async (): Promise<LogoutResponse> => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  return { message: "Logged out successfully." };
};

export type { LogoutResponse };
export { logoutApi };
