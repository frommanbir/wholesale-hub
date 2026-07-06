"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Default inactivity timeout of 15 minutes
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; 
const HEARTBEAT_INTERVAL = 60 * 1000; // 60 seconds
const STALE_TAB_TIMEOUT = 240 * 1000; // 240 seconds to consider a tab dead

export default function AdminSessionManager() {
  const router = useRouter();

  useEffect(() => {
    // Generate/Retrieve Tab ID
    let tabId = sessionStorage.getItem("admin_tab_id");
    if (!tabId) {
      tabId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("admin_tab_id", tabId);
    }

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

    // Register this tab & clean stale ones
    const registerTab = () => {
      try {
        const tabsStr = localStorage.getItem("admin_active_tabs") || "{}";
        const tabs = JSON.parse(tabsStr);
        const now = Date.now();

        // Update current tab heartbeat
        tabs[tabId!] = now;

        // Clean stale tabs
        for (const id in tabs) {
          if (now - tabs[id] > STALE_TAB_TIMEOUT) {
            delete tabs[id];
          }
        }

        localStorage.setItem("admin_active_tabs", JSON.stringify(tabs));
      } catch (e) {
        console.error("Failed to update active tabs", e);
      }
    };

    registerTab();
    const tabHeartbeat = setInterval(registerTab, HEARTBEAT_INTERVAL);

    // Monitor for inactivity & storage updates
    const checkSession = () => {
      const now = Date.now();
      const lastActivity = parseInt(localStorage.getItem("admin_last_activity") || "0", 10);

      // Check if session has expired due to inactivity
      if (lastActivity > 0 && now - lastActivity > INACTIVITY_TIMEOUT) {
        logout();
      }
    };

    const sessionCheckInterval = setInterval(checkSession, 5000);

    // Sync logout across tabs if another tab logged out
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "admin_logged_out" && e.newValue === "true") {
        router.push("/login");
        router.refresh();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    const logout = async () => {
      // Avoid infinite logout loops
      if (localStorage.getItem("admin_logged_out") === "true") return;

      localStorage.setItem("admin_logged_out", "true");
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (err) {
        console.error("Failed server logout", err);
      }
      router.push("/login");
      router.refresh();
    };

    // Unregister tab on page hide or visibility change
    const removeTab = () => {
      try {
        const tabsStr = localStorage.getItem("admin_active_tabs") || "{}";
        const tabs = JSON.parse(tabsStr);
        
        delete tabs[tabId!];
        
        // Clean stale tabs as well
        const now = Date.now();
        for (const id in tabs) {
          if (now - tabs[id] > STALE_TAB_TIMEOUT) {
            delete tabs[id];
          }
        }

        const activeTabsCount = Object.keys(tabs).length;
        localStorage.setItem("admin_active_tabs", JSON.stringify(tabs));

        // If this is the last tab being closed, trigger logout immediately
        if (activeTabsCount === 0) {
          localStorage.setItem("admin_logged_out", "true");
          // Use fetch with keepalive to ensure request completes during unload
          fetch("/api/auth/logout", {
            method: "POST",
            keepalive: true,
          });
        }
      } catch (e) {
        console.error("Failed to remove active tab", e);
      }
    };

    const handleVisibilityOrPageHide = () => {
      if (document.visibilityState === "hidden") {
        removeTab();
      } else {
        // Tab is visible again, check if we got logged out from another tab
        if (localStorage.getItem("admin_logged_out") === "true") {
          router.push("/login");
          router.refresh();
          return;
        }
        // Otherwise register tab and update activity
        registerTab();
        updateActivity();
      }
    };

    window.addEventListener("pagehide", removeTab);
    document.addEventListener("visibilitychange", handleVisibilityOrPageHide);

    return () => {
      events.forEach((event) => window.removeEventListener(event, updateActivity));
      clearInterval(tabHeartbeat);
      clearInterval(sessionCheckInterval);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("pagehide", removeTab);
      document.removeEventListener("visibilitychange", handleVisibilityOrPageHide);
      removeTab();
    };
  }, [router]);

  return null;
}
