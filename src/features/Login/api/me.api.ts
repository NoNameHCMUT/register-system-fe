import axiosClient, { globalConfig } from "@/shared/api";

const ME_ENDPOINT = "/auth/me";

const getMeApi = async () => {
  const response = await axiosClient.get(`${globalConfig}${ME_ENDPOINT}`);
  return response.data;
};

export { getMeApi };
