import axios from "axios";

export const Axios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        if (currentPath !== "/login") {
          console.log("Session expired. Logging out...");

          // 1. Clear Session Storage
          sessionStorage.removeItem("accessToken");

          // 2. FORCE DELETE COOKIE (Adjust "accessToken" to your actual cookie name)
          // Setting expires to a past date deletes it.
          document.cookie =
            "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

          // Also try clearing it without specific path just in case
          document.cookie =
            "accessToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT";

          // 3. Force Redirect
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);
