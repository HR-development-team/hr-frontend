"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";
import { useIdleTimer } from "./useIdleTimer";

const TIMEOUT_MS = 15 * 30 * 1000; // 7.5 Minutes (based on your math)

export type SessionState = "ACTIVE" | "EXPIRED" | "LOGGING_OUT";

export function useSessionManager() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [sessionState, setSessionState] = useState<SessionState>("ACTIVE");
  const hasExpiredRef = useRef(false);

  const isAuthenticated = !!user;
  const isTimerActive = isAuthenticated && sessionState === "ACTIVE";

  /**
   * ONE-WAY session expiration
   */
  const expireSession = useCallback(() => {
    if (hasExpiredRef.current) return;
    console.log("[SESSION] Expiring session now.");
    hasExpiredRef.current = true;
    setSessionState("EXPIRED");
  }, []);

  useIdleTimer(isTimerActive, expireSession);

  /**
   * 1. INITIAL LOAD CHECK
   */
  useEffect(() => {
    if (user) {
      const lastActiveStr = localStorage.getItem("lastActiveTime");
      const lastActive = lastActiveStr
        ? parseInt(lastActiveStr, 10)
        : Date.now();
      const timeDiff = Date.now() - lastActive;

      if (timeDiff > TIMEOUT_MS) {
        console.warn("[SESSION] Initial load: Found expired timestamp.");
        expireSession(); // Use the helper
      } else {
        // Only update if valid.
        localStorage.setItem("lastActiveTime", Date.now().toString());
      }
    }
  }, [user, expireSession]);

  /**
   * 2. VISIBILITY CHECK (Tab switching)
   */
  useEffect(() => {
    if (!isAuthenticated || sessionState !== "ACTIVE") return;

    const checkSessionValidity = () => {
      if (hasExpiredRef.current) return;

      const lastActiveStr = localStorage.getItem("lastActiveTime");
      if (!lastActiveStr) return;

      const lastActive = parseInt(lastActiveStr, 10);
      if (Date.now() - lastActive > TIMEOUT_MS) {
        expireSession();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") checkSessionValidity();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", checkSessionValidity); // Also check on focus

    checkSessionValidity();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", checkSessionValidity);
    };
  }, [isAuthenticated, sessionState, expireSession]);

  /**
   * 3. ACTIVITY LISTENER (The Fix)
   * Instead of blindly updating the time, we check the gap first.
   */
  useEffect(() => {
    if (!isTimerActive) return;

    const updateTimestamp = () => {
      if (hasExpiredRef.current) return;

      // [CRITICAL FIX] Read the OLD time first
      const lastActiveStr = localStorage.getItem("lastActiveTime");
      const lastActive = lastActiveStr
        ? parseInt(lastActiveStr, 10)
        : Date.now();

      // Calculate the gap between NOW and the LAST interaction
      const timeGap = Date.now() - lastActive;

      // If the gap is huge (e.g. 20 mins), it means the user just came back.
      // Do NOT update the time. EXPIRE them instead.
      if (timeGap > TIMEOUT_MS) {
        console.warn(
          "[SESSION] Activity detected, but session gap too large. Expiring..."
        );
        expireSession();
        return;
      }

      // If safe, update the time
      localStorage.setItem("lastActiveTime", Date.now().toString());
    };

    // Use specific events. 'click' and 'keydown' are safest.
    // 'mousemove' fires too often and might race condition.
    window.addEventListener("click", updateTimestamp);
    window.addEventListener("keydown", updateTimestamp);
    window.addEventListener("scroll", updateTimestamp);

    return () => {
      window.removeEventListener("click", updateTimestamp);
      window.removeEventListener("keydown", updateTimestamp);
      window.removeEventListener("scroll", updateTimestamp);
    };
  }, [isTimerActive, expireSession]);

  // ... (Rest of your logout logic)

  const confirmLogout = useCallback(async () => {
    setSessionState("LOGGING_OUT");
    localStorage.removeItem("lastActiveTime");
    await logout();
    router.replace("/login");
  }, [logout, router]);

  return {
    sessionState,
    isExpired: sessionState === "EXPIRED",
    confirmLogout,
  };
}
