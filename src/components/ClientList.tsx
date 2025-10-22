
import React from "react";
import { Client } from "@/types/client";

interface ClientListProps {
  clients: Client[];
}

const ClientList: React.FC<ClientListProps> = ({ clients }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">Clients</h2>
    <div>{clients.length} client(s) found.</div>
  </div>
);

export default ClientList;
