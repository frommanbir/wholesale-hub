"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Default inactivity timeout of 15 minutes
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
const HEARTBEAT_INTERVAL = 20 * 1000; // 60 seconds
const STALE_TAB_TIMEOUT = 360 * 1000; // 360 seconds to consider a tab dead

export default function AdminSessionManager() {
  const router = useRouter();

  useEffect(() => {
    // Clear logged out flag since we are currently mounting the admin layout (authenticated)
    localStorage.removeItem("admin_logged_out");

    // Set initial activity
    if (!localStorage.getItem("admin_last_activity")) {
      localStorage.setItem("admin_last_activity", Date.now().toString());
    }

    // Update last activity on interaction
    const updateActivity = () => {
      localStorage.setItem("admin_last_activity", Date.now().toString());
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, updateActivity));

    // Monitor for inactivity & storage updates
    const checkSession = () => {
      const now = Date.now();
      const lastActivity = parseInt(
        localStorage.getItem("admin_last_activity") || "0",
        10,
      );

      // Check if session has expired due to inactivity
      if (lastActivity > 0 && now - lastActivity > INACTIVITY_TIMEOUT) {
        logout();
      }
    };

    // Check session immediately on mount in case it expired while tab was sleeping/suspended
    checkSession();
    const sessionCheckInterval = setInterval(checkSession, 5000);

    // Sync logout across tabs if another tab logged out
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "admin_logged_out" && e.newValue === "true") {
        localStorage.removeItem("admin_last_tab");
        router.push("/login");
        router.refresh();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    const logout = async () => {
      // Avoid infinite logout loops
      if (localStorage.getItem("admin_logged_out") === "true") return;

      localStorage.setItem("admin_logged_out", "true");
      localStorage.removeItem("admin_last_tab");
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (err) {
        console.error("Failed server logout", err);
      }
      router.push("/login");
      router.refresh();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (localStorage.getItem("admin_logged_out") === "true") {
          router.push("/login");
          router.refresh();
          return;
        }
        checkSession();
        updateActivity();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateActivity),
      );
      clearInterval(sessionCheckInterval);
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [router]);

  return null;
}
