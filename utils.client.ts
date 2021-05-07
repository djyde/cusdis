import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
});

export const VERSION = '1.1.4'
