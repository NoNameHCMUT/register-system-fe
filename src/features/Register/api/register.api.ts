import axiosClient, { globalConfig } from "@/shared/api";

const REGISTER_ENDPOINT = "/auth/register";
const AFFILIATIONS_ENDPOINT = "/affiliations";

interface Affiliation {
  id: number;
  std_name: string;
}

interface AffiliationsResponse {
  data: Affiliation[];
}

interface RegisterPayload {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  school?: string;
  affiliationId?: number;
}

interface RegisterResponse {
  message?: string;
}

const registerApi = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const response = await axiosClient.post<RegisterResponse>(
    `${globalConfig}${REGISTER_ENDPOINT}`,
    payload,
  );
  return response.data;
};

const getAffiliationsApi = async (): Promise<Affiliation[]> => {
  const response = await axiosClient.get<AffiliationsResponse>(
    `${globalConfig}${AFFILIATIONS_ENDPOINT}`,
  );
  return response.data.data;
};

export type { Affiliation, RegisterPayload, RegisterResponse };
export { getAffiliationsApi, registerApi };
