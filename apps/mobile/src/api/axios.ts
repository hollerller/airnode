import axios from "axios";
import { authStore } from "../stores/authStore";

export const instance = axios.create({
  baseURL: "http://192.168.1.67:3000/",
  timeout: 1000,
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = authStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
