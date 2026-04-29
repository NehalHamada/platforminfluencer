import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";

const attachToken = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers.Accept = "application/json";

  return config;
};

const handleRequestError = (error: AxiosError) => Promise.reject(error);

const handleResponseError = (error: AxiosError) => {
  if (error.response) {
    console.error("API Error:", error.response.data);

    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
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
  timeout: 10000,
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
