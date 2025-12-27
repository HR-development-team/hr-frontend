"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";

// 10 Seconds for testing. Change to 15 * 60 * 1000 for production.
const TIMEOUT_MS = 15 * 60 * 1000;

export type SessionState = "ACTIVE" | "EXPIRED" | "LOGGING_OUT";

export function useSessionManager() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [sessionState, setSessionState] = useState<SessionState>("ACTIVE");
  const hasExpiredRef = useRef(false);

  // Helper: Get time
  const getLastActive = () => {
    if (typeof window === "undefined") return Date.now();
    const stored = localStorage.getItem("lastActiveTime");
    return stored ? parseInt(stored, 10) : Date.now();
  };

  // Helper: Set time (Throttled)
  // We use a ref to prevent spamming LocalStorage on every single mouse pixel move
  const lastUpdateRef = useRef(Date.now());

  const updateLastActive = useCallback(() => {
    const now = Date.now();
    // Only write to DB if 2 seconds have passed since last write
    // This improves performance significantly
    if (now - lastUpdateRef.current > 2000) {
      localStorage.setItem("lastActiveTime", now.toString());
      lastUpdateRef.current = now;
    }
  }, []);

  const isAuthenticated = !!user;
  const isTimerActive = isAuthenticated && sessionState === "ACTIVE";

  // --- 1. RESET ON LOGIN/LOGOUT ---
  useEffect(() => {
    if (!user) {
      hasExpiredRef.current = false;
      setSessionState("ACTIVE");
    } else {
      // Initialize time on mount if missing
      if (!localStorage.getItem("lastActiveTime")) {
        localStorage.setItem("lastActiveTime", Date.now().toString());
      }
    }
  }, [user]);

  // --- 2. EXPIRATION LOGIC ---
  const expireSession = useCallback(() => {
    if (hasExpiredRef.current) return;
    hasExpiredRef.current = true;
    setSessionState("EXPIRED");
  }, []);

  // --- 3. ACTIVITY LISTENERS (The Fix) ---
  // This explicitly updates LocalStorage when you move/click
  useEffect(() => {
    if (!isTimerActive) return;

    const handleActivity = () => updateLastActive();

    // 'mousemove' is heavy, so we rely on the throttling in updateLastActive
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, [isTimerActive, updateLastActive]);

  // --- 4. INTERVAL CHECKER ---
  // Checks every second if the LocalStorage time is too old
  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      const lastActive = getLastActive();
      if (Date.now() - lastActive > TIMEOUT_MS) {
        expireSession();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, expireSession]);

  // --- 5. LOGOUT ---
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
