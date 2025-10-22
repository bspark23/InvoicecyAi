
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Client } from "@/types/client";

interface ClientSelectorProps {
  clients: Client[];
  selectedClientId?: string;
  onSelectClient: (client: Client) => void;
  onAddNewClient: () => void;
}

const ClientSelector = ({
  clients,
  selectedClientId,
  onSelectClient,
  onAddNewClient,
}: ClientSelectorProps) => {
  return (
    <div className="flex gap-2">
      <Select
        value={selectedClientId}
        onValueChange={(value) => {
          const client = clients.find(c => c.id === value);
          if (client) onSelectClient(client);
        }}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select existing client or add new" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.name} - {client.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={onAddNewClient} variant="outline" size="sm">
        <Plus className="w-4 h-4 mr-2" />
        New Client
      </Button>
    </div>
  );
};

export default ClientSelector;
