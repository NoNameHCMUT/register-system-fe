import axiosClient, { globalConfig } from "@/shared/api";

const PENDING_USERS_ENDPOINT = "/admins/users/pending";
const ACTIVE_USERS_ENDPOINT = "/admins/users/active";

const ACCEPT_USER_ENDPOINT = (userId: number) =>
  `/admins/users/${userId}/accept`;
const REJECT_USER_ENDPOINT = (userId: number) =>
  `/admins/users/${userId}/reject`;

interface Affiliation {
  id: number;
  stdName: string;
}

interface PendingUser {
  affiliation: Affiliation;
  affiliationId: number;
  email: string;
  fullName: string;
  id: number;
  isActive: boolean;
  role: string;
  studentId: string;
  username: string;
}

interface PendingUserResponse {
  affiliation: {
    id: number;
    std_name: string;
  };
  affiliation_id: number;
  email: string;
  full_name: string;
  id: number;
  is_active: boolean;
  role: string;
  student_id: string;
  username: string;
}

const toPendingUser = (user: PendingUserResponse): PendingUser => {
  return {
    affiliation: {
      id: user.affiliation.id,
      stdName: user.affiliation.std_name,
    },
    affiliationId: user.affiliation_id,
    email: user.email,
    fullName: user.full_name,
    id: user.id,
    isActive: user.is_active,
    role: user.role,
    studentId: user.student_id,
    username: user.username,
  };
};

const getPendingUsersApi = async (): Promise<PendingUser[]> => {
  const response = await axiosClient.get<PendingUserResponse[]>(
    `${globalConfig}${PENDING_USERS_ENDPOINT}`,
  );
  return response.data.map(toPendingUser);
};

const getActiveUsersApi = async (): Promise<PendingUser[]> => {
  const response = await axiosClient.get<PendingUserResponse[]>(
    `${globalConfig}${ACTIVE_USERS_ENDPOINT}`,
  );
  return response.data.map(toPendingUser);
};

const acceptPendingUserApi = async (userId: number): Promise<PendingUser> => {
  const response = await axiosClient.post<PendingUserResponse>(
    `${globalConfig}${ACCEPT_USER_ENDPOINT(userId)}`,
  );
  return toPendingUser(response.data);
};

const rejectPendingUserApi = async (userId: number) => {
  const response = await axiosClient.post(
    `${globalConfig}${REJECT_USER_ENDPOINT(userId)}`,
  );
  return response.data;
};

export type { PendingUser };
export { acceptPendingUserApi, getPendingUsersApi, getActiveUsersApi, rejectPendingUserApi };
