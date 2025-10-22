
import React, { useState, useEffect } from "react";
import { 
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FileText, 
  Users, 
  FolderOpen, 
  BarChart3,
  Calendar,
  DollarSign,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInvoiceData } from "@/hooks/useInvoiceData";
import { useClients } from "@/hooks/useClients";
import { useAuthLocal } from "@/hooks/useAuthLocal";
import { formatCurrency, calculateTotal } from "@/utils/invoiceUtils";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'invoice' | 'client' | 'project' | 'report';
  data: any;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

interface GlobalSearchBarProps {
  className?: string;
}

const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  
  const navigate = useNavigate();
  const { user } = useAuthLocal();
  const { savedInvoices } = useInvoiceData(null, user?.email || user?.profileName);
  const { clients } = useClients(null, user?.email || user?.profileName);

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search function
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search invoices
    savedInvoices.forEach(invoice => {
      const matchesInvoice = 
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.clientName.toLowerCase().includes(query) ||
        invoice.notes.toLowerCase().includes(query) ||
        invoice.status.toLowerCase().includes(query);

      if (matchesInvoice) {
        searchResults.push({
          id: `invoice-${invoice.id}`,
          title: `Invoice ${invoice.invoiceNumber}`,
          subtitle: `${invoice.clientName} • ${formatCurrency(calculateTotal(invoice))} • ${invoice.status}`,
          type: 'invoice',
          data: invoice,
          icon: FileText,
          action: () => {
            navigate('/invoices');
            setIsOpen(false);
          }
        });
      }
    });

    // Search clients
    clients.forEach(client => {
      const matchesClient = 
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.address.toLowerCase().includes(query);

      if (matchesClient) {
        const clientInvoices = savedInvoices.filter(inv => 
          inv.clientName.toLowerCase() === client.name.toLowerCase()
        );
        const totalBilled = clientInvoices.reduce((sum, inv) => sum + calculateTotal(inv), 0);

        searchResults.push({
          id: `client-${client.id}`,
          title: client.name,
          subtitle: `${client.email} • ${clientInvoices.length} invoices • ${formatCurrency(totalBilled)} billed`,
          type: 'client',
          data: client,
          icon: Users,
          action: () => {
            navigate('/clients');
            setIsOpen(false);
          }
        });
      }
    });

    // Search projects (placeholder for future implementation)
    if (query.includes('project') || query.includes('work')) {
      searchResults.push({
        id: 'projects-page',
        title: 'Projects',
        subtitle: 'Manage your projects and time tracking',
        type: 'project',
        data: null,
        icon: FolderOpen,
        action: () => {
          navigate('/projects');
          setIsOpen(false);
        }
      });
    }

    // Search reports and analytics
    if (query.includes('report') || query.includes('analytics') || query.includes('dashboard')) {
      searchResults.push({
        id: 'dashboard-reports',
        title: 'Dashboard Reports',
        subtitle: 'View analytics and export reports',
        type: 'report',
        data: null,
        icon: BarChart3,
        action: () => {
          navigate('/dashboard');
          setIsOpen(false);
        }
      });
    }

    // Search payments
    if (query.includes('payment') || query.includes('paid') || query.includes('revenue')) {
      searchResults.push({
        id: 'payments-page',
        title: 'Payments',
        subtitle: 'Track payment history and revenue',
        type: 'report',
        data: null,
        icon: DollarSign,
        action: () => {
          navigate('/payments');
          setIsOpen(false);
        }
      });
    }

    // Search expenses
    if (query.includes('expense') || query.includes('cost')) {
      searchResults.push({
        id: 'expenses-page',
        title: 'Expense Tracker',
        subtitle: 'Manage business expenses',
        type: 'report',
        data: null,
        icon: DollarSign,
        action: () => {
          navigate('/expenses');
          setIsOpen(false);
        }
      });
    }

    // Search time tracking
    if (query.includes('time') || query.includes('hour') || query.includes('track')) {
      searchResults.push({
        id: 'time-tracking-page',
        title: 'Time Tracking',
        subtitle: 'Track work hours and billable time',
        type: 'project',
        data: null,
        icon: Clock,
        action: () => {
          navigate('/time-tracking');
          setIsOpen(false);
        }
      });
    }

    // Search calendar
    if (query.includes('calendar') || query.includes('schedule') || query.includes('date')) {
      searchResults.push({
        id: 'calendar-page',
        title: 'Calendar',
        subtitle: 'View invoice due dates and schedule',
        type: 'report',
        data: null,
        icon: Calendar,
        action: () => {
          navigate('/calendar');
          setIsOpen(false);
        }
      });
    }

    setResults(searchResults.slice(0, 10)); // Limit to 10 results
  }, [searchQuery, savedInvoices, clients, navigate]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'invoice':
        return 'bg-blue-100 text-blue-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      case 'project':
        return 'bg-purple-100 text-purple-800';
      case 'report':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className={`relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search everything...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search invoices, clients, projects, reports..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {searchQuery ? "No results found." : "Start typing to search..."}
          </CommandEmpty>
          
          {results.length > 0 && (
            <>
              {/* Group by type */}
              {['invoice', 'client', 'project', 'report'].map(type => {
                const typeResults = results.filter(r => r.type === type);
                if (typeResults.length === 0) return null;

                return (
                  <CommandGroup 
                    key={type}
                    heading={`${type.charAt(0).toUpperCase() + type.slice(1)}${typeResults.length > 1 ? 's' : ''}`}
                  >
                    {typeResults.map(result => {
                      const Icon = result.icon;
                      return (
                        <CommandItem
                          key={result.id}
                          onSelect={result.action}
                          className="flex items-center gap-3 p-3"
                        >
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate">{result.title}</span>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getTypeColor(result.type)}`}
                              >
                                {result.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {result.subtitle}
                            </p>
                          </div>
                          <CommandShortcut>Enter</CommandShortcut>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                );
              })}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default GlobalSearchBar;
