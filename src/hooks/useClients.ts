import { useState, useEffect } from "react";
import { Client, ClientFormData } from "@/types/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthLocal } from "@/hooks/useAuthLocal";

function getUserKey(userId?: string | null) {
  if (!userId) return "anon";
  return userId.toLowerCase().replace(/[^a-z0-9]/gi, "_");
}

// Supports multiple profiles AND users: data saved by user (email/profileName) and profileId for isolation/persistence
export const useClients = (profileId?: string | null, userId?: string | null) => {
  const { toast } = useToast();
  // Namespace using user and profile (like invoices)
  const USER_KEY = getUserKey(userId);
  const STORAGE_PREFIX = profileId 
    ? `user-${USER_KEY}-profile-${profileId}-` : `user-${USER_KEY}-`;

  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    if (!userId) return;
    const savedClients = localStorage.getItem(
      `${STORAGE_PREFIX}invoicer-pro-clients`
    );
    if (savedClients) {
      try {
        const parsed = JSON.parse(savedClients);
        setClients(parsed);
      } catch (error) {
        console.log("Error loading saved clients:", error);
      }
    }
    // eslint-disable-next-line
  }, [profileId, userId]);
  
  const saveClients = (clientList: Client[]) => {
    if (!userId) return;
    setClients(clientList);
    localStorage.setItem(
      `${STORAGE_PREFIX}invoicer-pro-clients`,
      JSON.stringify(clientList)
    );
  };

  const addClient = (clientData: ClientFormData) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedClients = [...clients, newClient];
    saveClients(updatedClients);

    toast({
      title: "Client Added",
      description: "Client has been saved successfully.",
    });

    return newClient;
  };

  const updateClient = (id: string, clientData: ClientFormData) => {
    const updatedClients = clients.map((client) =>
      client.id === id ? { ...client, ...clientData } : client
    );
    saveClients(updatedClients);

    toast({
      title: "Client Updated",
      description: "Client information has been updated.",
    });
  };

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter((client) => client.id !== id);
    saveClients(updatedClients);

    toast({
      title: "Client Deleted",
      description: "Client has been removed successfully.",
    });
  };

  const getClientById = (id: string) => {
    return clients.find((client) => client.id === id);
  };

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
  };
};
