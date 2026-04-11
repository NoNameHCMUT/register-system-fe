import axiosClient from "@/shared/api";

const REGISTER_ENDPOINT = "/auth/register";

interface RegisterPayload {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  school: string;
  city: string;
}

interface RegisterResponse {
  message?: string;
}

const registerApi = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const response = await axiosClient.post<RegisterResponse>(REGISTER_ENDPOINT, payload);
  return response.data;
};

export type { RegisterPayload, RegisterResponse };
export { registerApi };
