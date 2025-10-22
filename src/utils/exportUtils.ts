import { InvoiceData } from "@/types/invoice";

/**
 * Export invoice as PDF by capturing the DOM invoice preview with html2canvas,
 * then writing it to a PDF using jsPDF. Matches exactly what's on screen.
 */
export const exportToPDF = async (
  invoiceData,
  formatCurrency,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  toast
) => {
  try {
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    // Get the invoice DOM
    const invoiceElement = document.getElementById('invoice-preview');
    if (!invoiceElement) {
      throw new Error("Invoice preview element not found");
    }

    // Add export-mode class for better rendering if you have custom styles
    invoiceElement.classList.add('export-mode');

    // Render to canvas
    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fff'
    });

    invoiceElement.classList.remove('export-mode');

    // Get image data
    const imgData = canvas.toDataURL('image/png');

    // Create jsPDF with width/height to fit the image
    const pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);

    pdf.addImage(
      imgData,
      'PNG',
      0, 0,
      canvas.width, canvas.height
    );

    pdf.save(`${invoiceData.invoiceNumber}.pdf`);
    toast?.({ title: "Exported PDF", description: "Export successful" });
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast?.({ 
      title: "Export Failed", 
      description: "Could not generate PDF. Please try again.",
      variant: "destructive"
    });
  }
};

export const exportToImage = async (
  format: 'png' | 'jpeg',
  invoiceData: InvoiceData,
  formatCurrency: (amount: number, currencyCode?: string) => string,
  calculateSubtotal: () => number,
  calculateTax: () => number,
  calculateTotal: () => number,
  toast: any,
) => {
  try {
    const html2canvas = (await import('html2canvas')).default;

    const invoiceElement = document.getElementById('invoice-preview');
    if (!invoiceElement) {
      throw new Error("Invoice preview element not found");
    }

    invoiceElement.classList.add('export-mode');

    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    invoiceElement.classList.remove('export-mode');

    // Convert to image
    const image = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.95 : undefined);

    const link = document.createElement('a');
    link.download = `${invoiceData.invoiceNumber}.${format}`;
    link.href = image;
    link.click();

    toast?.({ 
      title: `Exported ${format.toUpperCase()}`, 
      description: "Export successful" 
    });
  } catch (error) {
    console.error(`Error generating ${format}:`, error);
    toast?.({ 
      title: "Export Failed", 
      description: `Could not generate ${format.toUpperCase()}. Please try again.`,
      variant: "destructive"
    });
  }
};

// Add exportInvoicePDFBase64 for EmailJS base64 PDF
export const exportInvoicePDFBase64 = async (
  invoiceData: InvoiceData,
  formatCurrency: (amount: number, currencyCode?: string) => string,
  calculateSubtotal: () => number,
  calculateTax: () => number,
  calculateTotal: () => number
) => {
  // This is almost the same as exportToPDF, but returns base64 string of pdf file (not triggers a download)
  try {
    const { jsPDF } = await import('jspdf');

    // Subtle light background
    const doc = new jsPDF('p', 'pt');
    doc.setFillColor(248, 250, 252); // light blue/gray background
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');

    // Header
    doc.setTextColor(40, 50, 85);
    doc.setFontSize(21);
    doc.text(invoiceData.businessName, 36, 50);

    // Business details
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(invoiceData.businessAddress, 36, 65);
    doc.text(invoiceData.businessEmail, 36, 80);

    // Invoice details
    doc.setFontSize(16);
    doc.setTextColor(40, 50, 85);
    doc.text("INVOICE", 450, 50);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 450, 65);
    doc.text(`Invoice Date: ${invoiceData.invoiceDate}`, 450, 80);
    doc.text(`Due Date: ${invoiceData.dueDate}`, 450, 95);

    // Client details
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text("Bill To:", 36, 130);
    doc.setFontSize(11);
    doc.text(invoiceData.clientName, 36, 145);
    doc.text(invoiceData.clientEmail, 36, 160);
    doc.text(invoiceData.clientAddress.split('\n').join(', '), 36, 175);

    // Add logo if available
    if (invoiceData.businessLogo) {
      try {
        doc.addImage(invoiceData.businessLogo, 'PNG', 450, 110, 100, 50);
      } catch (error) {
        console.error("Error adding logo to PDF:", error);
      }
    }

    // Tighter table with visible lines
    let startY = 230;
    const colWidths = [200, 70, 70, 90];
    doc.setFontSize(13);
    doc.setTextColor(33, 37, 41);

    // Use lighter gray for table border and row backgrounds
    doc.setLineWidth(0.7);
    doc.setDrawColor(210, 220, 235);

    const tableLeft = 36;
    // Header row
    doc.setFillColor(236, 240, 248); // even lighter gray
    doc.rect(tableLeft, startY, colWidths.reduce((a,b) => a+b), 26, "F");
    doc.rect(tableLeft, startY, colWidths.reduce((a,b) => a+b), 26);
    doc.text("Description", tableLeft+8, startY+17);
    doc.text("Qty", tableLeft+colWidths[0]+8, startY+17);
    doc.text("Rate", tableLeft+colWidths[0]+colWidths[1]+8, startY+17);
    doc.text("Amount", tableLeft+colWidths[0]+colWidths[1]+colWidths[2]+8, startY+17);
    startY += 26;

    // Table body
    invoiceData.lineItems.forEach((item, idx) => {
      const itemY = startY + idx*23;
      // Alternate row background for better readability
      if (idx % 2 === 0) {
        doc.setFillColor(244, 247, 252);
        doc.rect(tableLeft, itemY, colWidths.reduce((a,b) => a+b), 23, "F");
      }
      doc.rect(tableLeft, itemY, colWidths.reduce((a,b) => a+b), 23); // border for this row
      doc.text(String(item.description), tableLeft+8, itemY+15);
      doc.text(String(item.quantity), tableLeft+colWidths[0]+8, itemY+15);
      doc.text(formatCurrency(item.rate, invoiceData.currency), tableLeft+colWidths[0]+colWidths[1]+8, itemY+15);
      doc.text(formatCurrency(item.amount, invoiceData.currency), tableLeft+colWidths[0]+colWidths[1]+colWidths[2]+8, itemY+15);
    });

    // Crop: move totals/signature closer to the table if table is short
    let endTableY = startY + invoiceData.lineItems.length*23;
    let summaryY = endTableY + 18;
    if (invoiceData.lineItems.length < 4) summaryY -= (4-invoiceData.lineItems.length)*14;

    doc.setFontSize(14);
    doc.text(`Subtotal: ${formatCurrency(calculateSubtotal(), invoiceData.currency)}`, tableLeft, summaryY);
    doc.text(`Tax: ${formatCurrency(calculateTax(), invoiceData.currency)}`, tableLeft, summaryY+18);
    doc.text(`Discount: -${formatCurrency(invoiceData.discountAmount, invoiceData.currency)}`, tableLeft, summaryY+36);
    doc.setFontSize(17);
    doc.text(`Total: ${formatCurrency(calculateTotal(), invoiceData.currency)}`, tableLeft, summaryY+56);

    // Notes
    if (invoiceData.notes) {
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text("Notes:", tableLeft, summaryY + 85);
      doc.text(invoiceData.notes, tableLeft, summaryY + 100);
    }

    // Signature
    if (invoiceData.signatureImage) {
      try {
        doc.addImage(invoiceData.signatureImage, 'PNG', 400, summaryY + 85, 150, 60);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(400, summaryY + 155, 550, summaryY + 155);
        doc.setFontSize(10);
        doc.text("Authorized Signature", 450, summaryY + 170);
      } catch (error) {
        console.error("Error adding signature to PDF:", error);
      }
    }

    // Status watermark for paid invoices
    if (invoiceData.status === 'paid') {
      // Remove usage of GState since it's not supported
      // Instead, use a lighter text color for a watermark effect
      doc.setTextColor(100, 200, 100, 0.1); // green, but low alpha if supported
      doc.setFontSize(80);
      // Adding a BIG "PAID" watermark (no opacity, since not supported in all jsPDF)
      // Placing "PAID" diagonally (opacity best-effort with light color)
      doc.saveGraphicsState && doc.saveGraphicsState();
      doc.text("PAID", 250, 450, { angle: 45 });
      doc.restoreGraphicsState && doc.restoreGraphicsState();
      doc.setTextColor(40, 50, 85); // restore normal color
    }
    const pdfDataUriString = doc.output('datauristring');
    // Extract base64 from data:application/pdf;base64,.... for EmailJS
    const base64 = pdfDataUriString.split(',')[1];
    return base64;
  } catch (error) {
    throw new Error("Failed to generate invoice PDF for email.");
  }
};
