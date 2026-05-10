import axiosClient, { globalConfig } from "@/shared/api";

const ADD_AFFILIATIONS_ENDPOINT = "/admins/affiliations";

const addAffiliationsApi = async (payload: { std_name: string, description: string }) => {
    const response = await axiosClient.post(
        `${globalConfig}${ADD_AFFILIATIONS_ENDPOINT}`,
        payload
    );
    return response.data;
};

export { addAffiliationsApi };
