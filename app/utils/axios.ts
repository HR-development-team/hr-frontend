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
          console.log("Session expired. Cleaning up...");
          isLoggingOut = true;

          try {
            await Axios.delete("/api/auth/logout");
          } catch (e) {
            console.warn("Logout API failed", e);
          } finally {
            // 1. Clean up storage
            sessionStorage.removeItem("accessToken");
            localStorage.removeItem("lastActiveTime");

            // 2. DISPATCH EVENT instead of redirecting immediately
            // This tells the SessionGuard to open the Dialog
            window.dispatchEvent(new CustomEvent("auth:session-expired"));

            // We reset this shortly after so future errors can trigger it again if needed
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
