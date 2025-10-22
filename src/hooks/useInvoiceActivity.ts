
import { useCallback, useEffect, useState } from "react";
import { useAuthLocal } from "@/hooks/useAuthLocal";

export type ActivityEvent = {
  id?: number;
  type: "created" | "edited" | "downloaded" | "payment" | "client" | "email" | "estimate";
  timestamp: string;
  description: string;
  details?: string;
};

function getUserKey(userId?: string | null) {
  if (!userId) return "anon";
  return userId.toLowerCase().replace(/[^a-z0-9]/gi, "_");
}

function getLocalStorageKey(userId: string | undefined | null) {
  // Always prefer email, fallback to profileName, fallback to "anon"
  const userKey = getUserKey(userId);
  return `invoiceease-activity-events-${userKey}`;
}

export function useInvoiceActivity() {
  // Get current user from auth hook
  const { user } = useAuthLocal();
  // Always use email (preferred), else profileName, else "anon"
  const userId = user?.email || user?.profileName;

  const [events, setEvents] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    // Change key per user!
    const storageKey = getLocalStorageKey(userId);
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      setEvents([]); // clear events if switching user
    }
    // eslint-disable-next-line
  }, [userId]);

  const addEvent = useCallback(
    (type: ActivityEvent["type"], description: string) => {
      const newEvent: ActivityEvent = {
        type,
        timestamp: new Date().toISOString(),
        description,
      };
      const updatedEvents = [newEvent, ...events].slice(0, 50); // keep last 50 events
      setEvents(updatedEvents);
      const storageKey = getLocalStorageKey(userId);
      localStorage.setItem(storageKey, JSON.stringify(updatedEvents));
    },
    [events, userId]
  );

  return { events, addEvent };
}
