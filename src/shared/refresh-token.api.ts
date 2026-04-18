import axiosClient, { globalConfig } from "@/shared/api";

const REFRESH_TOKEN_ENDPOINT = "/auth/refresh_token";

interface RefreshTokenPayload {
  refresh_token: string;
}

interface RefreshTokenResponse {
  access_token?: string;
  refresh_token?: string;
}

export const refreshTokenApi = async (
  refreshToken: string,
): Promise<RefreshTokenResponse> => {
  const response = await axiosClient.post<RefreshTokenResponse>(
    `${globalConfig}${REFRESH_TOKEN_ENDPOINT}`,
    { refresh_token: refreshToken } satisfies RefreshTokenPayload,
  );
  return response.data;
};

export type { RefreshTokenResponse };
