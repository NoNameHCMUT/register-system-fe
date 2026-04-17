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

const getMeApi = async () => {
  const response = await axiosClient.get(`${globalConfig}${ME_ENDPOINT}`);
  return response.data;
};

export type { MeResponse };
export { getMeApi };
