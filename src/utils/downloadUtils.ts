
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const downloadAsPDF = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

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
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const downloadAsImage = async (elementId: string, filename: string, format: 'png' | 'jpg' = 'png') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: format === 'jpg' ? '#ffffff' : null
    });

    const imgData = canvas.toDataURL(`image/${format}`);
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = imgData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export const generateFileName = (invoiceNumber: string, clientName: string, format: string) => {
  const cleanInvoiceNumber = invoiceNumber.replace(/[^a-zA-Z0-9]/g, '-');
  const cleanClientName = clientName.replace(/[^a-zA-Z0-9]/g, '-');
  const timestamp = new Date().toISOString().slice(0, 10);
  
  return `Invoice-${cleanInvoiceNumber}-${cleanClientName}-${timestamp}.${format}`;
};
