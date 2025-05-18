import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Invoice, Customer } from "../types";

export const generatePDF = async (
  invoice: Invoice,
  customer: Customer | undefined
): Promise<void> => {
  try {
    const container = document.getElementById("invoice-container");
    if (!container) {
      throw new Error("Invoice container not found");
    }

    // Create a clone of the container to avoid modifying the original
    const clone = container.cloneNode(true) as HTMLElement;
    clone.style.width = "210mm"; // A4 width
    clone.style.padding = "10mm";
    document.body.appendChild(clone);

    // Render to canvas
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight,
    });

    // Remove the clone
    document.body.removeChild(clone);

    // Create PDF
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    pdf.addImage(
      imgData,
      "JPEG",
      0,
      0,
      imgWidth * ratio,
      imgHeight * ratio,
      undefined,
      "FAST"
    );

    // Download the PDF
    pdf.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
