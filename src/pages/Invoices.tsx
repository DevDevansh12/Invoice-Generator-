import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
  FilePlus,
  Eye,
  Edit,
  Trash2,
  Search,
  Mail,
  Download,
  Calendar,
} from "lucide-react";
import { Invoice } from "../types";
import { generatePDF } from "../utils/pdfGenerator";

const Invoices: React.FC = () => {
  const { invoices, deleteInvoice, customers } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    let filtered = [...invoices];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    // Apply search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((invoice) => {
        const customer = customers.find((c) => c.id === invoice.customerId);
        return (
          invoice.invoiceNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.dutyDescription
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      });
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setFilteredInvoices(filtered);
  }, [searchTerm, invoices, customers, statusFilter]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoice(id);
      setSelectedInvoices((prev) => prev.filter((invId) => invId !== id));
    }
  };

  const handleSelectInvoice = (id: string) => {
    setSelectedInvoices((prev) => {
      if (prev.includes(id)) {
        return prev.filter((invId) => invId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map((inv) => inv.id));
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedInvoices.length === 0) {
      alert("Please select at least one invoice to download");
      return;
    }

    // Download each selected invoice
    for (const id of selectedInvoices) {
      const invoice = invoices.find((inv) => inv.id === id);
      if (invoice) {
        await generatePDF(
          invoice,
          customers.find((c) => c.id === invoice.customerId)
        );
      }
    }
  };

  const handleEmailSelected = () => {
    if (selectedInvoices.length === 0) {
      alert("Please select at least one invoice to email");
      return;
    }

    // Demo: For now, just show which ones would be emailed
    const selectedInvoicesData = invoices.filter((inv) =>
      selectedInvoices.includes(inv.id)
    );
    alert(
      `You would email ${selectedInvoicesData.length} invoices to their respective customers`
    );

    // In a real implementation, this would trigger an email sending process
  };

  const handleExportAll = async () => {
    if (filteredInvoices.length === 0) {
      alert("No invoices to export");
      return;
    }

    // Export all filtered invoices
    for (const invoice of filteredInvoices) {
      await generatePDF(
        invoice,
        customers.find((c) => c.id === invoice.customerId)
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        <Button
          onClick={() => navigate("/invoices/create")}
          icon={<FilePlus size={20} />}
        >
          Create Invoice
        </Button>
      </div>

      <Card>
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="w-full sm:w-1/2">
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={20} className="text-gray-400" />}
              />
            </div>
            <div className="flex space-x-3">
              <select
                className="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          {selectedInvoices.length > 0 && (
            <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-blue-700">
                {selectedInvoices.length}{" "}
                {selectedInvoices.length === 1 ? "invoice" : "invoices"}{" "}
                selected
              </div>
              <div className="flex space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadSelected}
                  icon={<Download size={16} />}
                >
                  Download
                </Button>
                <Button
                  size="sm"
                  onClick={handleEmailSelected}
                  icon={<Mail size={16} />}
                >
                  Email
                </Button>
              </div>
            </div>
          )}
        </div>

        {filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={
                          selectedInvoices.length === filteredInvoices.length &&
                          filteredInvoices.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Invoice No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => {
                  const customer = customers.find(
                    (c) => c.id === invoice.customerId
                  );
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedInvoices.includes(invoice.id)}
                            onChange={() => handleSelectInvoice(invoice.id)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-1 text-gray-400" />
                          {new Date(invoice.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ₹{invoice.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "sent"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate(`/invoices/view/${invoice.id}`)
                            }
                            icon={<Eye size={16} />}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate(`/invoices/edit/${invoice.id}`)
                            }
                            icon={<Edit size={16} />}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(invoice.id)}
                            icon={<Trash2 size={16} />}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "No invoices match your search or filter criteria."
                : "No invoices found. Create your first invoice!"}
            </p>
          </div>
        )}

        {filteredInvoices.length > 0 && (
          <div className="mt-6 text-right">
            <Button
              variant="outline"
              onClick={handleExportAll}
              icon={<Download size={16} />}
            >
              Export All
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Invoices;
