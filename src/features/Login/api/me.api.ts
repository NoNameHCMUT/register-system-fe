import axiosClient, { globalConfig } from "@/shared/api";

const ME_ENDPOINT = "/auth/me";

interface MeResponse {
  affiliation: {
    id: number;
    std_name: string;
  };
  affiliation_id: number;
  email: string;
  full_name: string;
  id: number;
  is_active: boolean;
  role: string;
  student_id: string;
  username: string;
}

type WrappedMeResponse = {
  data: MeResponse;
};

const unwrapMeResponse = (
  payload: MeResponse | WrappedMeResponse,
): MeResponse => {
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return payload.data;
  }

  return payload;
};

const getMeApi = async (): Promise<MeResponse> => {
  const response = await axiosClient.get<MeResponse | WrappedMeResponse>(
    `${globalConfig}${ME_ENDPOINT}`,
  );
  return unwrapMeResponse(response);
};

export type { MeResponse };
export { getMeApi };
