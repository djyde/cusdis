import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    'x-timezone-offset': -new Date().getTimezoneOffset()
  }
});

export const VERSION = '1.2.1'
