import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  Users,
  FileText,
  FilePlus,
  UserPlus,
  Activity,
  MoreHorizontal,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const { customers, invoices } = useApp();
  const navigate = useNavigate();

  // Calculate stats
  const totalCustomers = customers.length;
  const totalInvoices = invoices.length;
  const draftInvoices = invoices.filter((inv) => inv.status === "draft").length;
  const sentInvoices = invoices.filter((inv) => inv.status === "sent").length;
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;

  // Calculate total revenue
  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + invoice.total,
    0
  );

  // Get recent invoices
  const recentInvoices = [...invoices]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="flex-1 sm:flex-none justify-center"
            onClick={() => navigate("/customers/add")}
            icon={<UserPlus size={18} />}
          >
            <span className="hidden xs:inline">Add Customer</span>
            <span className="xs:hidden">Customer</span>
          </Button>
          <Button
            size="sm"
            className="flex-1 sm:flex-none justify-center"
            onClick={() => navigate("/invoices/create")}
            icon={<FilePlus size={18} />}
          >
            <span className="hidden xs:inline">Create Invoice</span>
            <span className="xs:hidden">Invoice</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-blue-500 text-white mr-3 sm:mr-4">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-blue-800 font-medium">
                Total Customers
              </p>
              <h3 className="text-lg sm:text-2xl font-bold text-blue-900">
                {totalCustomers}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-indigo-500 text-white mr-3 sm:mr-4">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-indigo-800 font-medium">
                Total Invoices
              </p>
              <h3 className="text-lg sm:text-2xl font-bold text-indigo-900">
                {totalInvoices}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-green-500 text-white mr-3 sm:mr-4">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-green-800 font-medium">
                Total Revenue
              </p>
              <h3 className="text-lg sm:text-2xl font-bold text-green-900">
                ₹{totalRevenue.toFixed(2)}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex flex-col xs:flex-row items-start xs:items-center xs:justify-between w-full gap-2 xs:gap-0">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-purple-500 text-white mr-3 sm:mr-4">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-purple-800 font-medium">
                  Invoice Status
                </p>
              </div>
            </div>
            <div className="flex space-x-3 ml-10 xs:ml-0">
              <div className="text-center">
                <div className="text-xs text-purple-800">Draft</div>
                <div className="font-bold text-purple-900">{draftInvoices}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-purple-800">Sent</div>
                <div className="font-bold text-purple-900">{sentInvoices}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-purple-800">Paid</div>
                <div className="font-bold text-purple-900">{paidInvoices}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card title="Recent Invoices">
        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Invoice
                  </th>
                  <th
                    scope="col"
                    className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentInvoices.map((invoice) => {
                  const customer = customers.find(
                    (c) => c.id === invoice.customerId
                  );
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {customer?.name || "Unknown"}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        ₹{invoice.total.toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
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
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-right">
                        <div className="flex justify-end">
                          <Button
                            size="xs"
                            className="hidden sm:flex"
                            variant="outline"
                            onClick={() =>
                              navigate(`/invoices/view/${invoice.id}`)
                            }
                          >
                            View
                          </Button>
                          <Button
                            size="xs"
                            className="sm:hidden"
                            variant="ghost"
                            onClick={() =>
                              navigate(`/invoices/view/${invoice.id}`)
                            }
                            icon={<MoreHorizontal size={16} />}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            No invoices created yet. Start by creating your first invoice.
          </div>
        )}
        {recentInvoices.length > 0 && (
          <div className="mt-4 text-right">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/invoices")}
            >
              View All Invoices
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
