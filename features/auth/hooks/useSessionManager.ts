"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";
import { useIdleTimer } from "./useIdleTimer";

const TIMEOUT_MS = 15 * 30 * 1000;

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

    hasExpiredRef.current = true;
    setSessionState("EXPIRED");
  }, []);

  /**
   * Idle timeout
   */
  useIdleTimer(isTimerActive, expireSession);

  /**
   * Visibility / sleep detection
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
      if (document.visibilityState === "visible") {
        checkSessionValidity();
      }
    };

    const handleFocus = () => {
      checkSessionValidity();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    // Initial check
    checkSessionValidity();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [expireSession, isAuthenticated, sessionState]);

  /**
   * Activity timestamp sync
   */
  useEffect(() => {
    if (!isTimerActive) return;

    const updateTimestamp = () => {
      localStorage.setItem("lastActiveTime", Date.now().toString());
    };

    window.addEventListener("click", updateTimestamp);
    window.addEventListener("keydown", updateTimestamp);

    return () => {
      window.removeEventListener("click", updateTimestamp);
      window.removeEventListener("keydown", updateTimestamp);
    };
  }, [isTimerActive]);

  /**
   * RESET session state on fresh login
   */
  useEffect(() => {
    if (user) {
      hasExpiredRef.current = false;
      setSessionState("ACTIVE");
      localStorage.setItem("lastActiveTime", Date.now().toString());
    }
  }, [user]);

  useEffect(() => {
    console.log("[SESSION]", { sessionState, expired: hasExpiredRef.current });
  }, [sessionState]);

  /**
   * Logout handler
   */
  const confirmLogout = useCallback(async () => {
    if (sessionState !== "EXPIRED") return;

    setSessionState("LOGGING_OUT");
    localStorage.removeItem("lastActiveTime");

    await logout();
    router.replace("/login");
  }, [logout, router, sessionState]);

  return {
    sessionState,
    isExpired: sessionState === "EXPIRED",
    confirmLogout,
  };
}
