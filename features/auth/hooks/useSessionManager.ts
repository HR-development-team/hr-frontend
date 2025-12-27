"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";
import { useIdleTimer } from "./useIdleTimer";

const TIMEOUT_MS = 15 * 60 * 1000;

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

  /**
   * Idle timeout hook
   */
  useIdleTimer(isTimerActive, expireSession);

  /**
   * 1. INITIALIZATION CHECK (THE FIX)
   * When the user loads (e.g., page refresh), we check the timestamp BEFORE
   * deciding if they are "ACTIVE". This prevents the infinite loop.
   */
  useEffect(() => {
    if (user) {
      const lastActiveStr = localStorage.getItem("lastActiveTime");
      // If no time exists, assume it's a fresh login (Active)
      const lastActive = lastActiveStr
        ? parseInt(lastActiveStr, 10)
        : Date.now();

      const timeDiff = Date.now() - lastActive;

      // Check if we are ALREADY expired upon load
      if (timeDiff > TIMEOUT_MS) {
        console.warn(
          "[SESSION] Restored session is already expired. Diff:",
          timeDiff
        );
        hasExpiredRef.current = true;
        setSessionState("EXPIRED");
        // Do NOT update localStorage here. Keep the old time as proof.
      } else {
        // Session is valid, resume it
        hasExpiredRef.current = false;
        setSessionState("ACTIVE");
        localStorage.setItem("lastActiveTime", Date.now().toString());
      }
    }
  }, [user]);

  /**
   * 2. Visibility / sleep detection
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
   * 3. Activity timestamp sync
   */
  useEffect(() => {
    if (!isTimerActive) return;

    const updateTimestamp = () => {
      // Only update if we are NOT currently expired
      if (!hasExpiredRef.current) {
        localStorage.setItem("lastActiveTime", Date.now().toString());
      }
    };

    // Throttle this slightly in a real app, but this is fine for now
    window.addEventListener("click", updateTimestamp);
    window.addEventListener("keydown", updateTimestamp);

    return () => {
      window.removeEventListener("click", updateTimestamp);
      window.removeEventListener("keydown", updateTimestamp);
    };
  }, [isTimerActive]);

  useEffect(() => {
    console.log("[SESSION STATUS]", {
      sessionState,
      expired: hasExpiredRef.current,
    });
  }, [sessionState]);

  /**
   * Logout handler
   */
  const confirmLogout = useCallback(async () => {
    // Allow logout even if active (optional), but usually only if expired per your UI
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
