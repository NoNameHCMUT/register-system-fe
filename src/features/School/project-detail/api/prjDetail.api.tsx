import axiosClient, { globalConfig } from "@/shared/api";

const BATCH_SCHOOL_ACTION_ENDPOINT = "/schools/applicants/action";
const BATCH_COMMUNITY_ACTION_ENDPOINT = "/communities/applicants/action";

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

const getSchoolApplicantsApi = async (projectId: string): Promise<Applicant[]> => {
  const res = await axiosClient.get(
    `${globalConfig}/schools/projects/${projectId}/applicants`,
  );
  return res.data;
};


const getCommunityApplicantsApi = async (projectId: string): Promise<Applicant[]> => {
  const res = await axiosClient.get(
    `${globalConfig}/communities/projects/${projectId}/applicants`,
  );
  return res.data;
};


const batchSchoolApplicantActionApi = async (payload: {
  applicationIds: number[];
  action: "approve" | "reject";
}): Promise<{ message: string }> => {
  const res = await axiosClient.post(
    `${globalConfig}${BATCH_SCHOOL_ACTION_ENDPOINT}`,
    {
      application_ids: payload.applicationIds,
      action: payload.action,
    }
  );
  return res.data;
};

const batchCommunityApplicantActionApi = async (payload: {
  applicationIds: number[];
  action: "approve" | "reject";
}): Promise<{ message: string }> => {
  const res = await axiosClient.post(
    `${globalConfig}${BATCH_COMMUNITY_ACTION_ENDPOINT}`,
    {
      application_ids: payload.applicationIds,
      action: payload.action,
    }
  );
  return res.data;
};

export { getSchoolApplicantsApi, getCommunityApplicantsApi, batchSchoolApplicantActionApi, batchCommunityApplicantActionApi };
