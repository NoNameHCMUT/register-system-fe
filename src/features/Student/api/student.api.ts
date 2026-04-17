import axiosClient, { globalConfig } from "@/shared/api";

const STUDENT_PROJECTS_ENDPOINT = "/students/projects";
const APPLY_STUDENT_PROJECT_ENDPOINT = (projectId: number) =>
  `/students/projects/${projectId}/apply`;

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
  status: string;
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
  affiliation: AffiliationResponse;
  affiliation_id: number;
  banner_url: string;
  community_user: UserProfileResponse;
  community_user_id: number;
  created_at: string;
  date_approved: string;
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

interface StudentProjectApplicationResponse {
  created_at: string;
  id: number;
  project: StudentProjectResponse;
  project_id: number;
  status: string;
  user: UserProfileResponse;
  user_id: number;
}

const toAffiliation = (affiliation: AffiliationResponse): Affiliation => {
  return {
    description: affiliation.description,
    id: affiliation.id,
    stdName: affiliation.std_name,
  };
};

const toUserProfile = (user: UserProfileResponse): UserProfile => {
  return {
    affiliation: toAffiliation(user.affiliation),
    affiliationId: user.affiliation_id,
    avatarUrl: user.avatar_url,
    email: user.email,
    fullName: user.full_name,
    id: user.id,
    isActive: user.is_active,
    phone: user.phone,
    role: user.role,
    studentId: user.student_id,
    username: user.username,
  };
};

const toStudentProject = (project: StudentProjectResponse): StudentProject => {
  return {
    affiliation: toAffiliation(project.affiliation),
    affiliationId: project.affiliation_id,
    bannerUrl: project.banner_url,
    communityUser: toUserProfile(project.community_user),
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

const toStudentProjectApplication = (
  application: StudentProjectApplicationResponse,
): StudentProjectApplication => {
  return {
    createdAt: application.created_at,
    id: application.id,
    project: toStudentProject(application.project),
    projectId: application.project_id,
    status: application.status,
    user: toUserProfile(application.user),
    userId: application.user_id,
  };
};

const getStudentProjectsApi = async (): Promise<StudentProject[]> => {
  const response = await axiosClient.get<StudentProjectResponse[]>(
    `${globalConfig}${STUDENT_PROJECTS_ENDPOINT}`,
  );

  return response.data.map(toStudentProject);
};

const applyStudentProjectApi = async (
  projectId: number,
): Promise<StudentProjectApplication> => {
  const response = await axiosClient.post<StudentProjectApplicationResponse>(
    `${globalConfig}${APPLY_STUDENT_PROJECT_ENDPOINT(projectId)}`,
  );

  return toStudentProjectApplication(response.data);
};

export type {
  Affiliation,
  StudentProject,
  StudentProjectApplication,
  UserProfile,
};
export { applyStudentProjectApi, getStudentProjectsApi };
