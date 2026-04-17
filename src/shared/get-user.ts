import { useQuery } from "@tanstack/react-query";

import { getMeApi } from "@/features/Login/api/me.api";

const GET_USER_QUERY_KEY = ["auth", "me"] as const;

const getUser = async () => {
  const response = await getMeApi();

  if (
    typeof response === "object" &&
    response !== null &&
    "data" in response &&
    typeof response.data === "object" &&
    response.data !== null
  ) {
    return response.data;
  }

  return response;
};

const useGetUser = (enabled = true) => {
  return useQuery({
    queryKey: GET_USER_QUERY_KEY,
    queryFn: getUser,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export { GET_USER_QUERY_KEY, getUser, useGetUser };
