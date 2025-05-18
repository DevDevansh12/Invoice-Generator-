import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import Button from "../components/ui/Button";
import { ArrowLeft, Download, Mail, Edit, Printer } from "lucide-react";
import { generatePDF } from "../utils/pdfGenerator";
import { format } from "date-fns";

const ViewInvoice: React.FC = () => {
  const { invoices, customers, settings } = useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id) {
    navigate("/invoices");
    return null;
  }

  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) {
    navigate("/invoices");
    return null;
  }

  const customer = customers.find((c) => c.id === invoice.customerId);

  const handleDownload = async () => {
    await generatePDF(invoice, customer);
  };

  const handleEmailInvoice = () => {
    // This would normally send the invoice via email
    alert(
      `Invoice would be emailed to ${
        invoice.emailId || customer?.emailId || "the customer"
      }`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate subtotal
  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);

  // Calculate tax amounts
  const cgstAmount = subtotal * (invoice.cgst / 100);
  const sgstAmount = subtotal * (invoice.sgst / 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Controls - Only visible in browser, not in PDF */}
      <div className="flex justify-between items-center print:hidden">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="mr-4"
            onClick={() => navigate("/invoices")}
            icon={<ArrowLeft size={16} />}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">
            Invoice #{invoice.invoiceNumber}
          </h1>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handlePrint}
            icon={<Printer size={16} />}
          >
            Print
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            icon={<Download size={16} />}
          >
            Download
          </Button>
          <Button onClick={handleEmailInvoice} icon={<Mail size={16} />}>
            Email
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/invoices/edit/${id}`)}
            icon={<Edit size={16} />}
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Invoice Container - This is what gets rendered in the PDF */}
      <div
        id="invoice-container"
        className="bg-white border border-gray-200 rounded-lg shadow-sm mx-auto w-full print:border-none print:shadow-none"
        style={{ maxWidth: "210mm" }} // A4 width for better PDF generation
      >
        {/* Invoice Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">
                {settings.businessName}
              </h1>
              <p className="text-gray-600">{settings.businessAddress}</p>
              <p className="text-gray-600">
                {settings.businessEmail} | {settings.businessPhone}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Invoice #:</span>{" "}
                {invoice.invoiceNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Bill #:</span> {invoice.billNo}
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Date:</span>{" "}
                {format(new Date(invoice.date), "dd MMM yyyy")}
              </p>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Bill To:
              </h3>
              <p className="font-medium text-gray-800">{customer?.name}</p>
              <p className="text-gray-600">{invoice.address}</p>
              <p className="text-gray-600">{invoice.detailAddress}</p>
              <p className="text-gray-600">{invoice.contactNo}</p>
              <p className="text-gray-600">{invoice.emailId}</p>
              {invoice.gstNo && (
                <p className="text-gray-600">GST: {invoice.gstNo}</p>
              )}
              {invoice.panNo && (
                <p className="text-gray-600">PAN: {invoice.panNo}</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Duty Details:
              </h3>
              <p className="text-gray-600">
                <span className="font-medium">Booked By:</span>{" "}
                {invoice.bookedBy}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Guest Names:</span>{" "}
                {invoice.guestNames.map((g) => g.name).join(", ")}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Vehicle No:</span>{" "}
                {invoice.vehicleNo}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Vehicle Details:</span>{" "}
                {invoice.vehicleDetail}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Duty Period:</span>{" "}
                {format(new Date(invoice.dutyFrom), "dd MMM yyyy")} to{" "}
                {format(new Date(invoice.dutyTo), "dd MMM yyyy")}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Kilometers:</span>{" "}
                {invoice.kilometer}
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Invoice Items
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                  >
                    Rate
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                  >
                    Qty
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-gray-900 align-top">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right align-top">
                      ₹{item.rate.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right align-top">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right align-top">
                      ₹{item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Summary */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex justify-end">
              <div className="w-full md:w-1/2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">CGST ({invoice.cgst}%):</span>
                  <span>₹{cgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">SGST ({invoice.sgst}%):</span>
                  <span>₹{sgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>₹{invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details and Signature */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Duty Description
              </h3>
              <p className="text-gray-600">{invoice.dutyDescription}</p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Authorized Signature
              </h3>
              {invoice.signature && (
                <img
                  src={invoice.signature}
                  alt="Signature"
                  className="h-16 inline-block"
                />
              )}
              <p className="mt-2 text-gray-600">{settings.businessName}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 text-center text-gray-500 text-sm">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

// Add print-specific styles using CSS-in-JS
const PrintStyles = () => (
  <style>{`
    @media print {
      @page {
        size: A4;
        margin: 10mm;
      }
      body {
        margin: 0;
        padding: 0;
      }
      #invoice-container {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        box-shadow: none !important;
        border: none !important;
      }
    }
  `}</style>
);

const ViewInvoiceWithStyles = () => (
  <>
    <PrintStyles />
    <ViewInvoice />
  </>
);

export default ViewInvoiceWithStyles;
