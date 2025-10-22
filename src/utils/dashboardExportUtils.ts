
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData } from '@/types/invoice';
import { calculateTotal } from './invoiceUtils';
import { format } from 'date-fns';

export interface DashboardExportData {
  savedInvoices: InvoiceData[];
  formatCurrency: (amount: number, currencyCode?: string) => string;
}

// Helper function to get month-year from date string
function getMonthYear(dateString: string) {
  const date = new Date(dateString);
  return format(date, 'MMM yyyy');
}

// Generate dashboard summary data
export const generateDashboardSummary = (data: DashboardExportData) => {
  const { savedInvoices, formatCurrency } = data;
  
  // Calculate totals
  const totalInvoiced = savedInvoices.reduce((sum, invoice) => sum + calculateTotal(invoice), 0);
  const totalPayments = savedInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + calculateTotal(invoice), 0);
  const totalExpenses = 0; // Placeholder for future expense tracking
  const profit = totalPayments - totalExpenses;

  // Invoice status breakdown
  const paidInvoices = savedInvoices.filter(invoice => invoice.status === 'paid').length;
  const unpaidInvoices = savedInvoices.filter(invoice => invoice.status === 'unpaid').length;

  // Monthly data
  const monthlyData: { [month: string]: { invoices: number; payments: number; expenses: number } } = {};
  savedInvoices.forEach(inv => {
    const month = getMonthYear(inv.invoiceDate);
    if (!monthlyData[month]) monthlyData[month] = { invoices: 0, payments: 0, expenses: 0 };
    
    const total = calculateTotal(inv);
    monthlyData[month].invoices += total;
    
    if (inv.status === 'paid') {
      monthlyData[month].payments += total;
    }
  });

  // Top clients by payment
  const clientPayments = savedInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((acc, invoice) => {
      const client = invoice.clientName;
      acc[client] = (acc[client] || 0) + calculateTotal(invoice);
      return acc;
    }, {} as Record<string, number>);

  const topClients = Object.entries(clientPayments)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return {
    summary: {
      totalInvoiced,
      totalPayments,
      totalExpenses,
      profit,
      paidInvoices,
      unpaidInvoices,
      totalInvoices: savedInvoices.length
    },
    monthlyData: Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data
    })),
    topClients: topClients.map(([name, amount]) => ({ client: name, amount })),
    invoiceDetails: savedInvoices.map(inv => ({
      invoiceNumber: inv.invoiceNumber,
      clientName: inv.clientName,
      invoiceDate: inv.invoiceDate,
      dueDate: inv.dueDate,
      status: inv.status,
      amount: calculateTotal(inv)
    }))
  };
};

// Export to PDF
export const exportDashboardToPDF = async (elementId: string, filename: string = 'dashboard-report.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Dashboard element not found');

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};

// Export to CSV
export const exportDashboardToCSV = (data: DashboardExportData, filename: string = 'dashboard-report.csv') => {
  try {
    const dashboardData = generateDashboardSummary(data);
    
    // Create CSV content
    let csvContent = 'Dashboard Report\n';
    csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    // Summary section
    csvContent += 'SUMMARY\n';
    csvContent += `Total Invoiced,${data.formatCurrency(dashboardData.summary.totalInvoiced)}\n`;
    csvContent += `Total Payments,${data.formatCurrency(dashboardData.summary.totalPayments)}\n`;
    csvContent += `Total Expenses,${data.formatCurrency(dashboardData.summary.totalExpenses)}\n`;
    csvContent += `Profit,${data.formatCurrency(dashboardData.summary.profit)}\n`;
    csvContent += `Total Invoices,${dashboardData.summary.totalInvoices}\n`;
    csvContent += `Paid Invoices,${dashboardData.summary.paidInvoices}\n`;
    csvContent += `Unpaid Invoices,${dashboardData.summary.unpaidInvoices}\n\n`;
    
    // Monthly data
    csvContent += 'MONTHLY DATA\n';
    csvContent += 'Month,Invoices,Payments,Expenses\n';
    dashboardData.monthlyData.forEach(month => {
      csvContent += `${month.month},${data.formatCurrency(month.invoices)},${data.formatCurrency(month.payments)},${data.formatCurrency(month.expenses)}\n`;
    });
    csvContent += '\n';
    
    // Top clients
    csvContent += 'TOP CLIENTS\n';
    csvContent += 'Client,Amount\n';
    dashboardData.topClients.forEach(client => {
      csvContent += `${client.client},${data.formatCurrency(client.amount)}\n`;
    });
    csvContent += '\n';
    
    // Invoice details
    csvContent += 'INVOICE DETAILS\n';
    csvContent += 'Invoice Number,Client,Date,Due Date,Status,Amount\n';
    dashboardData.invoiceDetails.forEach(inv => {
      csvContent += `${inv.invoiceNumber},${inv.clientName},${inv.invoiceDate},${inv.dueDate},${inv.status},${data.formatCurrency(inv.amount)}\n`;
    });

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
};

// Export to Excel
export const exportDashboardToExcel = (data: DashboardExportData, filename: string = 'dashboard-report.xlsx') => {
  try {
    const dashboardData = generateDashboardSummary(data);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = [
      ['Dashboard Report'],
      [`Generated on: ${new Date().toLocaleDateString()}`],
      [],
      ['SUMMARY'],
      ['Metric', 'Value'],
      ['Total Invoiced', data.formatCurrency(dashboardData.summary.totalInvoiced)],
      ['Total Payments', data.formatCurrency(dashboardData.summary.totalPayments)],
      ['Total Expenses', data.formatCurrency(dashboardData.summary.totalExpenses)],
      ['Profit', data.formatCurrency(dashboardData.summary.profit)],
      ['Total Invoices', dashboardData.summary.totalInvoices],
      ['Paid Invoices', dashboardData.summary.paidInvoices],
      ['Unpaid Invoices', dashboardData.summary.unpaidInvoices]
    ];
    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');
    
    // Monthly data sheet
    const monthlySheetData = [
      ['Month', 'Invoices', 'Payments', 'Expenses'],
      ...dashboardData.monthlyData.map(month => [
        month.month,
        month.invoices,
        month.payments,
        month.expenses
      ])
    ];
    const monthlyWS = XLSX.utils.aoa_to_sheet(monthlySheetData);
    XLSX.utils.book_append_sheet(wb, monthlyWS, 'Monthly Data');
    
    // Top clients sheet
    const clientsSheetData = [
      ['Client', 'Amount'],
      ...dashboardData.topClients.map(client => [
        client.client,
        client.amount
      ])
    ];
    const clientsWS = XLSX.utils.aoa_to_sheet(clientsSheetData);
    XLSX.utils.book_append_sheet(wb, clientsWS, 'Top Clients');
    
    // Invoice details sheet
    const invoicesSheetData = [
      ['Invoice Number', 'Client', 'Date', 'Due Date', 'Status', 'Amount'],
      ...dashboardData.invoiceDetails.map(inv => [
        inv.invoiceNumber,
        inv.clientName,
        inv.invoiceDate,
        inv.dueDate,
        inv.status,
        inv.amount
      ])
    ];
    const invoicesWS = XLSX.utils.aoa_to_sheet(invoicesSheetData);
    XLSX.utils.book_append_sheet(wb, invoicesWS, 'Invoice Details');
    
    // Save file
    XLSX.writeFile(wb, filename);
  } catch (error) {
    console.error('Error exporting Excel:', error);
    throw error;
  }
};
