import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { UserPlus, Edit, Trash2, Search, Phone, Mail } from "lucide-react";
import { Customer } from "../types";

const Customers: React.FC = () => {
  const { customers, deleteCustomer } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.emailId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phoneNo.includes(searchTerm) ||
          customer.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      deleteCustomer(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <Button
          onClick={() => navigate("/customers/add")}
          icon={<UserPlus size={20} />}
        >
          Add Customer
        </Button>
      </div>

      <Card>
        <div className="mb-6">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={20} className="text-gray-400" />}
          />
        </div>

        {filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    GST/PAN
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
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone size={16} className="mr-1 text-gray-400" />
                          {customer.phoneNo}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail size={16} className="mr-1 text-gray-400" />
                          {customer.emailId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {customer.city}, {customer.state}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.country} - {customer.pinCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        GST: {customer.gstNo || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        PAN: {customer.panNo || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/customers/edit/${customer.id}`)
                          }
                          icon={<Edit size={16} />}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(customer.id)}
                          icon={<Trash2 size={16} />}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">
              {searchTerm
                ? "No customers match your search."
                : "No customers found. Add your first customer!"}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Customers;
