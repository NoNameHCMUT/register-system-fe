import axiosClient, { globalConfig } from "@/shared/api";

const PROJECTS_ENDPOINT = "/projects";
const COMMUNITY_PROJECTS_ENDPOINT = "/community/projects";

interface CommunityProject {
  affiliation: {
    description: string;
    id: number;
    stdName: string;
  };
  affiliationId: number;
  bannerUrl: string;
  communityUserId: number;
  createdAt: string;
  dateApproved: string | null;
  description: string;
  formEndDay: string;
  formStartDay: string;
  id: number;
  name: string;
  numAttending: number;
  numMax: number;
  projectEndDay: string;
  projectStartDay: string;
}

interface CommunityProjectResponse {
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

interface ProjectPayload {
  affiliationId: number;
  bannerUrl?: string;
  description: string;
  formEndDay: string;
  formStartDay: string;
  name: string;
  numMax: number;
  projectEndDay: string;
  projectStartDay: string;
}

interface UploadProjectBannerPayload {
  banner: File;
  projectId: number;
}

const createProjectApi = async (payload: ProjectPayload) => {
  const response = await axiosClient.post(
    `${globalConfig}${PROJECTS_ENDPOINT}`,
    payload,
  );

  return response.data;
};

const uploadProjectBannerApi = async ({
  banner,
  projectId,
}: UploadProjectBannerPayload) => {
  const formData = new FormData();
  formData.append("banner", banner);

  const response = await axiosClient.post(
    `${globalConfig}${PROJECTS_ENDPOINT}/${projectId}/banner`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

const toCommunityProject = (
  project: CommunityProjectResponse,
): CommunityProject => {
  return {
    affiliation: {
      description: project.affiliation.description,
      id: project.affiliation.id,
      stdName: project.affiliation.std_name,
    },
    affiliationId: project.affiliation_id,
    bannerUrl: project.banner_url,
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

const getCommunityProjectsApi = async (): Promise<CommunityProject[]> => {
  const response = await axiosClient.get<
    CommunityProjectResponse[] | { data: CommunityProjectResponse[] }
  >(`${globalConfig}${COMMUNITY_PROJECTS_ENDPOINT}`);

  const rawResponse = response as unknown;
  const projectList = Array.isArray(rawResponse)
    ? rawResponse
    : Array.isArray((rawResponse as { data?: unknown }).data)
      ? ((rawResponse as { data: CommunityProjectResponse[] }).data ?? [])
      : [];

  return projectList.map(toCommunityProject);
};

export type { CommunityProject, ProjectPayload };
export { createProjectApi, getCommunityProjectsApi, uploadProjectBannerApi };
