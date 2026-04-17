import axiosClient, { globalConfig } from "@/shared/api";

const APPLICANTS_ENDPOINT = (projectId: string) => `/schools/projects/${projectId}/applicants`;
const BATCH_ACTION_ENDPOINT = "/schools/applicants/action";

export interface Applicant {
    id: number;
    fullname: string;
    studentId: string;
    major: string;
    status: 'pending' | 'accepted' | 'rejected';
}

const getApplicantsApi = async (projectId: string): Promise<Applicant[]> => {
    const res = await axiosClient.get(
        `${globalConfig}${APPLICANTS_ENDPOINT(projectId)}`
    );
    return res.data;
};

const batchApplicantActionApi = async (payload: {
    userIds: number[],
    action: 'accept' | 'reject'
}): Promise<{ message: string }> => {
    const res = await axiosClient.post(
        `${globalConfig}${BATCH_ACTION_ENDPOINT}`,
        payload
    );
    return res.data;
};

export { getApplicantsApi, batchApplicantActionApi };