import axiosClient, { globalConfig } from "@/shared/api";

const PROJECTS_ENDPOINT = "/projects";
const COMMUNITY_PROJECTS_ENDPOINT = "/community/projects";

interface CommunityProject {
  dateApproved: string | null;
  id: number;
}

interface CommunityProjectResponse {
  date_approved: string | null;
  id: number;
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
    dateApproved: project.date_approved,
    id: project.id,
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
