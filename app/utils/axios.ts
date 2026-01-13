import axios from "axios";

export const Axios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

let isLoggingOut = false;

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        if (currentPath !== "/login" && !isLoggingOut) {
          isLoggingOut = true;

          try {
            await Axios.delete("/api/auth/logout");
          } catch (e) {
            console.warn("Backend logout failed - token likely expired", e);
          } finally {
            await fetch("/api/auth/cleanup", { method: "POST" });

            sessionStorage.removeItem("accessToken");
            localStorage.removeItem("lastActiveTime");

            window.dispatchEvent(new CustomEvent("auth:session-expired"));

            setTimeout(() => {
              isLoggingOut = false;
            }, 1000);
          }
        }
      }
    }
    return Promise.reject(error);
  }
);
