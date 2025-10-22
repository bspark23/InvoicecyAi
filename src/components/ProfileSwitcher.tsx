
import React, { useState } from "react";
import { User, Settings, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useProfiles } from "@/hooks/useProfiles";

export default function ProfileSwitcher() {
  const {
    profiles,
    activeProfileId,
    activeProfile,
    setActiveProfile,
    createProfile,
    deleteProfile
  } = useProfiles();

  const [creating, setCreating] = useState(false);
  const [profileName, setProfileName] = useState("");

  const handleCreate = () => {
    if (profileName.trim()) {
      createProfile({ name: profileName.trim() });
      setProfileName("");
      setCreating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 min-w-[150px]">
          <User className="w-4 h-4" />
          {activeProfile ? activeProfile.name : "Select Business"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="z-50 bg-white dark:bg-gray-800 w-60">
        {profiles.map(profile => (
          <DropdownMenuItem
            key={profile.id}
            onClick={() => setActiveProfile(profile.id)}
            className={`flex items-center gap-2 ${activeProfileId === profile.id ? "font-bold" : ""}`}
          >
            {activeProfileId === profile.id && <Check className="w-4 h-4 text-green-600" />}
            <span className="truncate">{profile.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="!ml-auto text-destructive p-0 hover:bg-red-50 dark:hover:bg-red-900"
              onClick={e => {
                e.stopPropagation();
                deleteProfile(profile.id);
              }}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild>
          <div className="w-full mt-2">
            {creating ? (
              <div className="flex gap-1">
                <Input
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  placeholder="Business name"
                  autoFocus
                  className="h-8"
                  onKeyDown={e => {
                    if (e.key === "Enter") handleCreate();
                    if (e.key === "Escape") { setCreating(false); setProfileName(""); }
                  }}
                />
                <Button size="sm" className="h-8" onClick={handleCreate}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" className="w-full text-left" onClick={() => setCreating(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Business
              </Button>
            )}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
