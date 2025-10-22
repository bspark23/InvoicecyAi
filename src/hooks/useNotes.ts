
import { useCallback, useState, useEffect } from "react";
import { useAuthLocal } from "@/hooks/useAuthLocal";

// Note type
export type Note = {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
};

function getUserKey(userId: string | undefined | null) {
  if (!userId) return "anon";
  return userId.toLowerCase().replace(/[^a-z0-9]/gi, "_");
}

function getStorageKey(userId: string | undefined | null) {
  // Only show notes for current user
  return `invoiceease-user-notes-${getUserKey(userId)}`;
}

export function useNotes() {
  const { user } = useAuthLocal();
  const userId = user?.email || user?.profileName;
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setNotes([]);
      return;
    }
    setIsLoading(true);
    try {
      const notesData = localStorage.getItem(getStorageKey(userId));
      if (notesData) {
        setNotes(JSON.parse(notesData));
      } else {
        setNotes([]);
      }
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const saveNotes = useCallback(
    (nextNotes: Note[]) => {
      if (userId) {
        localStorage.setItem(getStorageKey(userId), JSON.stringify(nextNotes));
      }
      setNotes(nextNotes);
    },
    [userId]
  );

  const addNote = {
    isPending: false,
    mutateAsync: async (content: string) => {
      if (!userId) throw new Error("Not authenticated");
      const now = new Date().toISOString();
      const newNote: Note = {
        id: Date.now().toString(),
        content,
        created_at: now,
        updated_at: now,
        user_id: userId,
      };
      const nextNotes = [newNote, ...notes];
      saveNotes(nextNotes);
      return newNote;
    },
  };

  const updateNote = {
    isPending: false,
    mutateAsync: async ({ id, content }: { id: string; content: string }) => {
      const now = new Date().toISOString();
      const nextNotes = notes.map((n) =>
        n.id === id
          ? { ...n, content, updated_at: now }
          : n
      );
      saveNotes(nextNotes);
      return nextNotes.find((n) => n.id === id);
    },
  };

  const deleteNote = {
    isPending: false,
    mutate: (id: string) => {
      const nextNotes = notes.filter((n) => n.id !== id);
      saveNotes(nextNotes);
      return id;
    },
  };

  return { notes, isLoading, error, addNote, updateNote, deleteNote };
}
