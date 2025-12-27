import axios from "axios";

export const Axios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for 401 Unauthorized
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        // --- CRITICAL FIX ---
        if (!currentPath.startsWith("/auth/login")) {
          console.log("Session expired. Logging out...");
          sessionStorage.removeItem("accessToken");
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);
