import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export class DataExportService {
  static async exportToPDF(elementId: string, fileName: string) {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fbf9f6',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height / canvas.width) * pdfWidth;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}.pdf`);
    } catch (err) {
      console.error("PDF Export failed:", err);
      throw err;
    }
  }

  static async exportJournalToPDF(entries: any[], profileName: string) {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Header
    pdf.setFontSize(22);
    pdf.setTextColor(78, 99, 90); // #4e635a
    pdf.text("رحلتي في سند", pageWidth / 2, 20, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setTextColor(100);
    pdf.text(`مذكرات: ${profileName}`, pageWidth / 2, 30, { align: 'center' });
    
    let y = 50;
    
    entries.forEach((entry, i) => {
      if (y > 270) {
        pdf.addPage();
        y = 30;
      }
      
      pdf.setFontSize(12);
      pdf.setTextColor(50);
      const date = entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString('ar-SA') : new Date(entry.createdAt).toLocaleDateString('ar-SA');
      pdf.text(`${date}:`, pageWidth - 20, y, { align: 'right' });
      
      y += 10;
      pdf.setFontSize(14);
      pdf.setTextColor(0);
      const lines = pdf.splitTextToSize(entry.content, pageWidth - 40);
      pdf.text(lines, pageWidth - 20, y, { align: 'right' });
      
      y += lines.length * 7 + 15;
    });
    
    pdf.save("my-spiritual-journey.pdf");
  }
}
