import axiosClient, { globalConfig } from "@/shared/api";

const APPROVE_CAMPAIGN_ENDPOINT = (projectId: number) =>
  `/schools/projects/${projectId}/approve`;

const approveSchoolCampaignApi = async (projectId: number) => {
  const response = await axiosClient.post(
    `${globalConfig}${APPROVE_CAMPAIGN_ENDPOINT(projectId)}`,
  );

  return response.data;
};

export { approveSchoolCampaignApi };
