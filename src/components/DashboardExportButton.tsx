
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Table, Sheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InvoiceData } from "@/types/invoice";
import {
  exportDashboardToPDF,
  exportDashboardToCSV,
  exportDashboardToExcel,
  DashboardExportData
} from "@/utils/dashboardExportUtils";

interface DashboardExportButtonProps {
  savedInvoices: InvoiceData[];
  formatCurrency: (amount: number, currencyCode?: string) => string;
  dashboardElementId?: string;
}

const DashboardExportButton: React.FC<DashboardExportButtonProps> = ({
  savedInvoices,
  formatCurrency,
  dashboardElementId = "dashboard-content"
}) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportData: DashboardExportData = {
    savedInvoices,
    formatCurrency
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const filename = `dashboard-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      await exportDashboardToPDF(dashboardElementId, filename);
      toast({
        title: "Success",
        description: "Dashboard exported as PDF successfully!",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Error",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const filename = `dashboard-report-${new Date().toISOString().slice(0, 10)}.csv`;
      exportDashboardToCSV(exportData, filename);
      toast({
        title: "Success",
        description: "Dashboard exported as CSV successfully!",
      });
    } catch (error) {
      console.error('CSV export error:', error);
      toast({
        title: "Error",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      const filename = `dashboard-report-${new Date().toISOString().slice(0, 10)}.xlsx`;
      exportDashboardToExcel(exportData, filename);
      toast({
        title: "Success",
        description: "Dashboard exported as Excel successfully!",
      });
    } catch (error) {
      console.error('Excel export error:', error);
      toast({
        title: "Error",
        description: "Failed to export Excel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (savedInvoices.length === 0) {
    return (
      <Button variant="outline" disabled>
        <Download className="w-4 h-4 mr-2" />
        Export Reports
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? "Exporting..." : "Export Reports"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV}>
          <Table className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          <Sheet className="w-4 h-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardExportButton;
