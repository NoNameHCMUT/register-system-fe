import axiosClient from "@/shared/api";

const LOGIN_ENDPOINT = "/auth/login";

interface LoginPayload {
	username: string;
	password: string;
}

interface LoginResponse {
	accessToken?: string;
	refreshToken?: string;
	message?: string;
}

const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
	const response = await axiosClient.post<LoginResponse>(LOGIN_ENDPOINT, payload);
	return response.data;
};

export type { LoginPayload, LoginResponse };
export { loginApi };
