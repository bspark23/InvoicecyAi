
import { useState, useEffect } from "react";

export type BusinessProfile = {
  id: string;
  name: string;
  logo?: string;
  email?: string;
  address?: string;
  // More fields if needed
};

const PROFILES_KEY = "invoiceease-business-profiles";
const ACTIVE_PROFILE_KEY = "invoiceease-active-profile-id";

// Generate a safe unique id for storage. Never changes, even if business name changes.
function generateProfileId() {
  return "profile-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  // Load profiles and active profile from localStorage ONCE
  useEffect(() => {
    const saved = localStorage.getItem(PROFILES_KEY);
    setProfiles(saved ? JSON.parse(saved) : []);
    const active = localStorage.getItem(ACTIVE_PROFILE_KEY);
    setActiveProfileId(active || null);
  }, []);

  // Keep storage in sync
  useEffect(() => {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }, [profiles]);

  // Save activeProfileId change
  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId);
    }
  }, [activeProfileId]);

  // Only create a new profile if explicitly requested
  const createProfile = (profile: Omit<BusinessProfile, "id">) => {
    // Check uniqueness of businessName
    const nameExists = profiles.some((p) => p.name === profile.name);
    if (nameExists) {
      alert("Business name already exists. Please choose a different name.");
      return null;
    }
    const newProfile: BusinessProfile = {
      ...profile,
      id: generateProfileId(),
    };
    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    return newProfile;
  };

  // Robustly delete
  const deleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (activeProfileId === id) {
      // Set another profile as active or null
      const others = profiles.filter((p) => p.id !== id);
      setActiveProfileId(others.length > 0 ? others[0].id : null);
    }
    // No additional storage changes
  };

  // Update existing profile info (but never the id)
  const updateProfile = (id: string, data: Partial<BusinessProfile>) => {
    setProfiles((prev) => prev.map((p) => p.id === id ? { ...p, ...data } : p));
  };

  const setActiveProfile = (id: string) => {
    setActiveProfileId(id);
  };

  // Always get the current active profile object or null
  const getActiveProfile = () => profiles.find((p) => p.id === activeProfileId) || null;

  // SAFE: Do NOT create new profiles automatically if a profile exists already.
  // Initial load always uses saved data in localStorage.

  return {
    profiles,
    activeProfileId,
    activeProfile: getActiveProfile(),
    createProfile,
    updateProfile,
    deleteProfile,
    setActiveProfile,
  };
}

