import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";

const attachToken = (config: InternalAxiosRequestConfig) => {
  const skipAuth = config.headers["X-Skip-Auth"];
  delete config.headers["X-Skip-Auth"];

  if (skipAuth) {
    return config;
  }

  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  config.headers.Accept = "application/json";

  return config;
};

const handleRequestError = (error: AxiosError) => Promise.reject(error);

const handleResponseError = (error: AxiosError) => {
  if (error.response) {
    console.error("API Error:", error.response.data);

    if (error.response.status === 401) {
      const isLogoutRequest = error.config?.url?.includes("/api/logout");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("auth-storage");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("auth-storage");

      if (!isLogoutRequest && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  } else {
    console.error("Network Error:", error.message);
  }

  return Promise.reject(error);
};

export const authClients = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const api = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

authClients.interceptors.request.use(attachToken, handleRequestError);
authClients.interceptors.response.use(
  (response) => response,
  handleResponseError,
);

api.interceptors.request.use(attachToken, handleRequestError);
api.interceptors.response.use((response) => response, handleResponseError);
