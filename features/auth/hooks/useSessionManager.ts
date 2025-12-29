"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";

// 15 Minutes (15 * 60 * 1000)
const TIMEOUT_MS = 15 * 60 * 1000;

export type SessionState = "ACTIVE" | "EXPIRED" | "LOGGING_OUT";

export function useSessionManager() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [sessionState, setSessionState] = useState<SessionState>("ACTIVE");
  const hasExpiredRef = useRef(false);
  const lastUpdateRef = useRef(Date.now());

  // --- HELPER: Get Time ---
  const getLastActive = () => {
    if (typeof window === "undefined") return Date.now();
    const stored = localStorage.getItem("lastActiveTime");
    return stored ? parseInt(stored, 10) : Date.now();
  };

  // --- HELPER: Update Time (Throttled) ---
  const updateLastActive = useCallback(() => {
    const now = Date.now();
    // Throttle writes to LocalStorage (once every 2 seconds max)
    if (now - lastUpdateRef.current > 2000) {
      localStorage.setItem("lastActiveTime", now.toString());
      lastUpdateRef.current = now;
    }
  }, []);

  const isAuthenticated = !!user;
  // Only run the timer if user is logged in AND not already expired
  const isTimerActive = isAuthenticated && sessionState === "ACTIVE";

  // --- 1. INITIALIZATION ---
  useEffect(() => {
    if (!isAuthenticated) {
      // Reset state when logged out
      hasExpiredRef.current = false;
      setSessionState("ACTIVE");
    } else {
      // If logging in, set the initial time if missing
      if (!localStorage.getItem("lastActiveTime")) {
        localStorage.setItem("lastActiveTime", Date.now().toString());
      }
    }
  }, [isAuthenticated]);

  // --- 2. EXPIRATION LOGIC ---
  const expireSession = useCallback(() => {
    if (hasExpiredRef.current) return;
    hasExpiredRef.current = true;
    setSessionState("EXPIRED");
  }, []);

  // --- 3. ACTIVITY LISTENERS ---
  useEffect(() => {
    if (!isTimerActive) return;

    // Trigger update on user interaction
    const handleActivity = () => updateLastActive();

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
  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      const lastActive = getLastActive();
      const now = Date.now();

      // Check if time has passed the limit
      if (now - lastActive > TIMEOUT_MS) {
        expireSession();
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [isTimerActive, expireSession]);

  // --- 5. LOGOUT HANDLER ---
  const confirmLogout = useCallback(async () => {
    setSessionState("LOGGING_OUT");

    // Clear the idle timer data
    localStorage.removeItem("lastActiveTime");

    // Perform standard logout (clear session/tokens)
    await logout();

    // Redirect to the correct path
    router.replace("/login");
  }, [logout, router]);

  return {
    sessionState,
    isExpired: sessionState === "EXPIRED",
    confirmLogout,
  };
}
