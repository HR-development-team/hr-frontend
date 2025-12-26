import { useEffect, useRef, useCallback } from "react";
import { keepSessionAlive } from "../services/authApi";

// 15 Minutes
const IDLE_TIMEOUT = 15 * 30 * 1000;
// Heartbeat every 2 mins
const HEARTBEAT_INTERVAL = 2 * 60 * 1000;

export const useIdleTimer = (shouldRun: boolean, onTimeout: () => void) => {
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastHeartbeatTime = useRef<number>(Date.now());

  // Action: Trigger the timeout callback
  const handleTimeout = useCallback(() => {
    onTimeout();
  }, [onTimeout]);

  // Action: Send Heartbeat
  const sendHeartbeat = useCallback(async () => {
    const now = Date.now();

    if (now - lastHeartbeatTime.current > HEARTBEAT_INTERVAL) {
      // 1. UPDATE IMMEDIATELY to "close the gate"
      lastHeartbeatTime.current = now;

      try {
        await keepSessionAlive();
      } catch (error) {
        console.error("Heartbeat failed", error);
      }
    }
  }, []);

  // Event: User did something
  const handleActivity = useCallback(() => {
    // Reset the "Bomb"
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    logoutTimerRef.current = setTimeout(handleTimeout, IDLE_TIMEOUT);

    // Check if we need to ping server
    sendHeartbeat();
  }, [handleTimeout, sendHeartbeat]);

  useEffect(() => {
    // If we shouldn't run (e.g. not logged in OR dialog is open), do nothing.
    if (!shouldRun) return;

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    // Start the initial timer
    logoutTimerRef.current = setTimeout(handleTimeout, IDLE_TIMEOUT);

    // Listen for movement
    events.forEach((event) => window.addEventListener(event, handleActivity));

    // Cleanup: Stop everything if component unmounts OR shouldRun becomes false
    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
    };
  }, [shouldRun, handleActivity, handleTimeout]);
};
