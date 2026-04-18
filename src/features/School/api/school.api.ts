import axiosClient, { globalConfig } from "@/shared/api";

const approveSchoolCampaignApi = async (projectId: number) => {
  const response = await axiosClient.post(
    `${globalConfig}/schools/projects/${projectId}/approve`,
  );

  return response.data;
};

import type { CampaignItem } from "@/components/CampaignBrowser";

interface SchoolProjectResponse {
  affiliation: {
    description: string;
    id: number;
    std_name: string;
  };
  affiliation_id: number;
  banner_url: string;
  community_user_id: number;
  created_at: string;
  date_approved: string | null;
  description: string;
  form_end_day: string;
  form_start_day: string;
  id: number;
  name: string;
  num_attending: number;
  num_max: number;
  project_end_day: string;
  project_start_day: string;
}

const toSchoolCampaign = (project: SchoolProjectResponse) => {
  return {
    affiliation: {
      description: project.affiliation.description,
      id: project.affiliation.id,
      stdName: project.affiliation.std_name,
    },
    affiliationId: project.affiliation_id,
    bannerUrl: `${globalConfig}/uploads${project.banner_url}`,
    communityUserId: project.community_user_id,
    createdAt: project.created_at,
    dateApproved: project.date_approved,
    description: project.description,
    formEndDay: project.form_end_day,
    formStartDay: project.form_start_day,
    id: project.id,
    name: project.name,
    numAttending: project.num_attending,
    numMax: project.num_max,
    projectEndDay: project.project_end_day,
    projectStartDay: project.project_start_day,
  };
};
const getSchoolCampaignApi = async (): Promise<CampaignItem[]> => {
  const response = await axiosClient.get(`${globalConfig}/schools/projects`);
  const raw = response.data;

  const projectList = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
      ? raw.data
      : [];
  return projectList.map(toSchoolCampaign);
};

export { approveSchoolCampaignApi, getSchoolCampaignApi };
