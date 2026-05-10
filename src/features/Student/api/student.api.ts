import axiosClient, { globalConfig } from "@/shared/api";

const STUDENT_APPLICATIONS_ENDPOINT = "/students/applications";
const APPLY_STUDENT_PROJECT_ENDPOINT = (projectId: number) =>
  `/students/projects/${projectId}/apply`;

type StudentApplicationStatus = "SCHOOL_PENDING" | "COMMUNITY_PENDING" | "APPROVED" | string;

interface Affiliation {
  description: string;
  id: number;
  stdName: string;
}

interface UserProfile {
  affiliation: Affiliation;
  affiliationId: number;
  avatarUrl: string;
  email: string;
  fullName: string;
  id: number;
  isActive: boolean;
  phone: string;
  role: string;
  studentId: string;
  username: string;
}

interface StudentProject {
  affiliation: Affiliation;
  affiliationId: number;
  bannerUrl: string;
  communityUser: UserProfile;
  communityUserId: number;
  createdAt: string;
  dateApproved: string;
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

interface StudentProjectApplication {
  createdAt: string;
  id: number;
  project: StudentProject;
  projectId: number;
  status: StudentApplicationStatus;
  user: UserProfile;
  userId: number;
}

interface AffiliationResponse {
  description: string;
  id: number;
  std_name: string;
}

interface UserProfileResponse {
  affiliation: AffiliationResponse;
  affiliation_id: number;
  avatar_url: string;
  email: string;
  full_name: string;
  id: number;
  is_active: boolean;
  phone: string;
  role: string;
  student_id: string;
  username: string;
}

interface StudentProjectResponse {
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

const toStudentProject = (project: StudentProjectResponse) => {
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

interface StudentProjectApplicationResponse {
  created_at: string;
  id: number;
  project: StudentProjectResponse;
  project_id: number;
  status: StudentApplicationStatus;
  user: UserProfileResponse;
  user_id: number;
}

const getStudentProjectsApi = async () => {
  const response = await axiosClient.get<StudentProjectResponse[]>(
    `${globalConfig}/students/projects`,
  );

  return response.data.map(toStudentProject);
};

const applyStudentProjectApi = async (projectId: number) => {
  const response = await axiosClient.post<StudentProjectApplicationResponse>(
    `${globalConfig}${APPLY_STUDENT_PROJECT_ENDPOINT(projectId)}`,
  );

  return response.data;
};

const getStudentApplicationsApi = async () => {
  const response = await axiosClient.get(
    `${globalConfig}${STUDENT_APPLICATIONS_ENDPOINT}`,
  );

  const raw = response.data as any;
  if (raw && Array.isArray(raw.data)) {
    return raw.data;
  }
  return Array.isArray(raw) ? raw : [];
};


export type {
  Affiliation,
  StudentApplicationStatus,
  StudentProject,
  StudentProjectApplication,
  UserProfile,
};
export {
  applyStudentProjectApi,
  getStudentApplicationsApi,
  getStudentProjectsApi,
};
