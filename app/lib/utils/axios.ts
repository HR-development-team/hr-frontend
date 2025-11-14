import { API_URL } from "@/api/api";
import axios from "axios";

export const Axios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
