import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useApp } from "../contexts/AppContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import { Invoice, GuestName, InvoiceItem, Customer } from "../types";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { format } from "date-fns";

type FormValues = Omit<Invoice, "id" | "createdAt">;

const CreateInvoice: React.FC = () => {
  const { customers, addInvoice, updateInvoice, getInvoice, settings } =
    useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [signature, setSignature] = useState<SignatureCanvas | null>(null);
  const [signatureURL, setSignatureURL] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      invoiceNumber: "",
      billNo: "",
      date: format(new Date(), "yyyy-MM-dd"),
      customerId: "",
      bookedBy: "",
      guestNames: [{ id: "1", name: "" }],
      vehicleNo: "",
      address: "",
      detailAddress: "",
      contactNo: "",
      emailId: "",
      gstNo: "",
      panNo: "",
      dutyFrom: format(new Date(), "yyyy-MM-dd"),
      dutyTo: format(new Date(), "yyyy-MM-dd"),
      kilometer: "",
      vehicleDetail: "",
      rate: 0,
      dutyDescription: "",
      cgst: settings.taxRate.CGST,
      sgst: settings.taxRate.SGST,
      total: 0,
      items: [
        {
          id: "1",
          description: "",
          rate: 0,
          quantity: 1,
          amount: 0,
        },
      ],
      signature: "",
      status: "draft",
    },
  });

  // Setup field arrays for guest names and items
  const {
    fields: guestFields,
    append: appendGuest,
    remove: removeGuest,
  } = useFieldArray({
    control,
    name: "guestNames",
  });

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: "items",
  });

  // Watch values for calculations
  const watchItems = watch("items");
  const watchCGST = watch("cgst");
  const watchSGST = watch("sgst");
  const watchCustomerId = watch("customerId");

  // Update totals when items change
  useEffect(() => {
    const subtotal = watchItems.reduce(
      (sum, item) => sum + item.rate * item.quantity,
      0
    );

    // Calculate taxes
    const cgstAmount = subtotal * (watchCGST / 100);
    const sgstAmount = subtotal * (watchSGST / 100);

    // Calculate total
    const total = subtotal + cgstAmount + sgstAmount;

    setValue("total", total);
  }, [watchItems, watchCGST, watchSGST, setValue]);

  // Load invoice data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const invoice = getInvoice(id);
      if (invoice) {
        // Exclude 'id' and 'createdAt' when setting form values
        const { id: _, createdAt: __, ...invoiceData } = invoice;
        reset(invoiceData);
        setSignatureURL(invoice.signature);
      } else {
        navigate("/invoices");
      }
    }
  }, [isEditMode, id, getInvoice, reset, navigate]);

  // Update customer details when customer changes
  useEffect(() => {
    if (watchCustomerId) {
      const customer = customers.find((c) => c.id === watchCustomerId);
      if (customer) {
        setSelectedCustomer(customer);
        setValue("address", customer.address);
        setValue("gstNo", customer.gstNo);
        setValue("panNo", customer.panNo);
        setValue("contactNo", customer.phoneNo);
        setValue("emailId", customer.emailId);
      }
    }
  }, [watchCustomerId, customers, setValue]);

  // Handle signature
  const clearSignature = () => {
    if (signature) {
      signature.clear();
      setSignatureURL("");
    }
  };

  const saveSignature = () => {
    if (signature) {
      const dataURL = signature.toDataURL();
      setSignatureURL(dataURL);
      setValue("signature", dataURL);
    }
  };

  // Add new item
  const addNewItem = () => {
    appendItem({
      id: `item-${Date.now()}`,
      description: "",
      rate: 0,
      quantity: 1,
      amount: 0,
    });
  };

  // Add new guest
  const addNewGuest = () => {
    appendGuest({
      id: `guest-${Date.now()}`,
      name: "",
    });
  };

  // Update item amount when rate or quantity changes
  const updateItemAmount = (index: number, rate: number, quantity: number) => {
    const amount = rate * quantity;
    setValue(`items.${index}.amount`, amount);
  };

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    data.signature = signatureURL;

    if (isEditMode && id) {
      updateInvoice(id, data);
    } else {
      addInvoice(data);
    }

    navigate("/invoices");
  };

  return (
    <div className="space-y-6">
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
          {isEditMode ? "Edit Invoice" : "Create New Invoice"}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Input
                label="Invoice Number"
                placeholder="INV-0001"
                error={errors.invoiceNumber?.message}
                {...register("invoiceNumber", {
                  required: "Invoice number is required",
                })}
              />
            </div>
            <div>
              <Input
                label="Bill Number"
                placeholder="BILL-0001"
                error={errors.billNo?.message}
                {...register("billNo", { required: "Bill number is required" })}
              />
            </div>
            <div>
              <Input
                label="Date"
                type="date"
                error={errors.date?.message}
                {...register("date", { required: "Date is required" })}
              />
            </div>
          </div>

          {/* Customer Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Select Customer"
                  error={errors.customerId?.message}
                  options={customers.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  {...register("customerId", {
                    required: "Customer is required",
                  })}
                />
              </div>

              <div>
                <Input
                  label="Booked By"
                  placeholder="Name of the person who booked"
                  error={errors.bookedBy?.message}
                  {...register("bookedBy")}
                />
              </div>

              {/* Guest Names */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guest Names
                </label>
                <div className="space-y-3">
                  {guestFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Input
                        placeholder={`Guest ${index + 1} name`}
                        {...register(`guestNames.${index}.name`, {
                          required: "Guest name is required",
                        })}
                        error={errors.guestNames?.[index]?.name?.message}
                      />
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeGuest(index)}
                        disabled={guestFields.length <= 1}
                        icon={<Trash2 size={16} />}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addNewGuest}
                    icon={<Plus size={16} />}
                  >
                    Add Guest
                  </Button>
                </div>
              </div>

              <div>
                <Input
                  label="Vehicle Number"
                  placeholder="Vehicle registration number"
                  error={errors.vehicleNo?.message}
                  {...register("vehicleNo")}
                />
              </div>

              <div>
                <Input
                  label="Contact Number"
                  placeholder="Customer contact number"
                  error={errors.contactNo?.message}
                  {...register("contactNo")}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Address"
                  placeholder="Customer address"
                  error={errors.address?.message}
                  {...register("address")}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Detailed Address"
                  placeholder="Additional address details"
                  error={errors.detailAddress?.message}
                  {...register("detailAddress")}
                />
              </div>

              <div>
                <Input
                  label="Email ID"
                  type="email"
                  placeholder="Customer email"
                  error={errors.emailId?.message}
                  {...register("emailId")}
                />
              </div>

              <div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="GST Number"
                    placeholder="GST number"
                    error={errors.gstNo?.message}
                    {...register("gstNo")}
                  />

                  <Input
                    label="PAN Number"
                    placeholder="PAN number"
                    error={errors.panNo?.message}
                    {...register("panNo")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Duty Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Duty Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Input
                  label="Duty From"
                  type="date"
                  error={errors.dutyFrom?.message}
                  {...register("dutyFrom")}
                />
              </div>

              <div>
                <Input
                  label="Duty To"
                  type="date"
                  error={errors.dutyTo?.message}
                  {...register("dutyTo")}
                />
              </div>

              <div>
                <Input
                  label="Kilometers"
                  placeholder="Total kilometers"
                  error={errors.kilometer?.message}
                  {...register("kilometer")}
                />
              </div>

              <div>
                <Input
                  label="Vehicle Details"
                  placeholder="Make, model, etc."
                  error={errors.vehicleDetail?.message}
                  {...register("vehicleDetail")}
                />
              </div>

              <div>
                <Input
                  label="Rate"
                  type="number"
                  placeholder="Base rate"
                  error={errors.rate?.message}
                  {...register("rate", { valueAsNumber: true })}
                />
              </div>

              <div className="md:col-span-3">
                <Input
                  label="Duty Description"
                  placeholder="Description of services provided"
                  error={errors.dutyDescription?.message}
                  {...register("dutyDescription")}
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Invoice Items
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Rate
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {itemFields.map((field, index) => (
                    <tr key={field.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Input
                          placeholder="Item description"
                          {...register(`items.${index}.description`, {
                            required: "Description is required",
                          })}
                          error={errors.items?.[index]?.description?.message}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...register(`items.${index}.rate`, {
                            valueAsNumber: true,
                            onChange: (e) =>
                              updateItemAmount(
                                index,
                                parseFloat(e.target.value),
                                watch(`items.${index}.quantity`) || 0
                              ),
                          })}
                          error={errors.items?.[index]?.rate?.message}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Input
                          type="number"
                          placeholder="1"
                          {...register(`items.${index}.quantity`, {
                            valueAsNumber: true,
                            onChange: (e) =>
                              updateItemAmount(
                                index,
                                watch(`items.${index}.rate`) || 0,
                                parseFloat(e.target.value)
                              ),
                          })}
                          error={errors.items?.[index]?.quantity?.message}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Input
                          type="number"
                          readOnly
                          {...register(`items.${index}.amount`, {
                            valueAsNumber: true,
                          })}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeItem(index)}
                          disabled={itemFields.length <= 1}
                          icon={<Trash2 size={16} />}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewItem}
                icon={<Plus size={16} />}
              >
                Add Item
              </Button>
            </div>
          </div>

          {/* Tax Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Tax Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="CGST (%)"
                  type="number"
                  {...register("cgst", { valueAsNumber: true })}
                  error={errors.cgst?.message}
                />
              </div>

              <div>
                <Input
                  label="SGST (%)"
                  type="number"
                  {...register("sgst", { valueAsNumber: true })}
                  error={errors.sgst?.message}
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center text-lg font-medium">
                <span>Total Amount:</span>
                <span>₹{watch("total").toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Digital Signature */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Digital Signature
            </h3>

            <div className="border border-gray-300 rounded-md overflow-hidden bg-white mb-4">
              {signatureURL ? (
                <div className="p-4">
                  <img
                    src={signatureURL}
                    alt="Your signature"
                    className="max-h-32 mx-auto"
                  />
                </div>
              ) : (
                <SignatureCanvas
                  ref={(ref) => setSignature(ref)}
                  canvasProps={{
                    width: 600,
                    height: 150,
                    className: "signature-canvas w-full",
                  }}
                  backgroundColor="white"
                />
              )}
            </div>

            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={clearSignature}>
                Clear
              </Button>

              <Button type="button" onClick={saveSignature}>
                Save Signature
              </Button>
            </div>
          </div>

          {/* Invoice Status */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Invoice Status
            </h3>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="draft"
                  {...register("status")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span>Draft</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="sent"
                  {...register("status")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span>Sent</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="paid"
                  {...register("status")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span>Paid</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/invoices")}
            >
              Cancel
            </Button>
            <Button type="submit" icon={<Save size={16} />}>
              {isEditMode ? "Update Invoice" : "Save Invoice"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateInvoice;
