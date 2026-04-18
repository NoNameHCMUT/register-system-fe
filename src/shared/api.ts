import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import _ from "lodash";
import { toast } from "sonner";
import { refreshTokenApi } from "@/shared/refresh-token.api";

export const globalConfig = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: globalConfig.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    value.constructor === Object
  );
};

const toSnakeCase = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map((v) => toSnakeCase(v));
  }

  if (isPlainObject(obj)) {
    return Object.keys(obj).reduce<Record<string, unknown>>((result, key) => {
      const snakeKey = _.snakeCase(key);
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {});
  }

  return obj;
};

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response) {
    const resData = error.response.data;

    if (error.response.status !== 200) {
      toast.error(resData.error);
      return
    }

    if (isPlainObject(resData) && resData.details) {
      const errorMessages = Object.values(resData.details).flat();

      if (errorMessages.length > 0) {
        toast.error(errorMessages[0] as string);
        return;
      }
    }
    toast.error(resData || "Network error!");
  } else {
    toast.error("Something went wrong. Please try again.");
  }
};

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("accessToken");
    // const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    // if (refreshToken) {
    //   config.headers.set("Authorization", `Bearer ${refreshToken}`);
    // }

    if (config.data && !(config.data instanceof FormData)) {
      config.data = toSnakeCase(config.data);
    }

    if (config.params) {
      config.params = toSnakeCase(config.params);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const data = await refreshTokenApi(refreshToken);

        if (data.access_token) {
          localStorage.setItem("accessToken", data.access_token);
        }
        if (data.refresh_token) {
          localStorage.setItem("refreshToken", data.refresh_token);
        }

        processQueue(null);
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
