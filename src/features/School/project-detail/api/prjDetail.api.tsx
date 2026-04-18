import axiosClient, { globalConfig } from "@/shared/api";

const BATCH_ACTION_ENDPOINT = "/schools/applicants/action";

export interface UserInfo {
  id: number;
  full_name: string;
  student_id: string;
  email: string;
  phone: string;
  username: string;
  avatar_url: string;
}

export interface Applicant {
  id: number;
  application_id: number;
  project_id: number;
  status: "SCHOOL_PENDING" | "SCHOOL_APPROVED" | string;
  created_at: string;
  user: UserInfo;
}

const getApplicantsApi = async (projectId: string): Promise<Applicant[]> => {
  const res = await axiosClient.get(
    `${globalConfig}/schools/projects/${projectId}/applicants`,
  );
  return res.data;
};

const batchApplicantActionApi = async (payload: {
  applicationIds: number[];
  action: "approve" | "reject";
}): Promise<{ message: string }> => {
  const res = await axiosClient.post(
    `${globalConfig}${BATCH_ACTION_ENDPOINT}`,
    payload,
  );
  return res.data;
};

export { getApplicantsApi, batchApplicantActionApi };
