interface LogoutResponse {
  message?: string;
}

export const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  return { message: "Logged out successfully." };
};

export type { LogoutResponse };
