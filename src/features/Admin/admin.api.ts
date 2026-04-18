import axiosClient, { globalConfig } from "@/shared/api";

const ADMIN_PROJECTS_ENDPOINT = "/admins/projects";

interface AdminProject {
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

interface AdminProjectResponse {
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

const toAdminProject = (
    project: AdminProjectResponse,
): AdminProject => {
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

const getAdminProjects = async (): Promise<AdminProject[]> => {
    const response = await axiosClient.get<
        AdminProjectResponse[] | { data: AdminProjectResponse[] }
    >(`${globalConfig}${ADMIN_PROJECTS_ENDPOINT}`);

    const rawResponse = response as unknown;
    const projectList = Array.isArray(rawResponse)
        ? rawResponse
        : Array.isArray((rawResponse as { data?: unknown }).data)
            ? ((rawResponse as { data: AdminProjectResponse[] }).data ?? [])
            : [];

    return projectList.map(toAdminProject);
};

export type { AdminProject };
export { getAdminProjects };
