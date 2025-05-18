import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useApp } from "../contexts/AppContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Customer } from "../types";
import { ArrowLeft, Save } from "lucide-react";

type FormValues = Omit<Customer, "id">;

const AddCustomer: React.FC = () => {
  const { addCustomer, updateCustomer, getCustomer } = useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>();

  useEffect(() => {
    if (isEditMode && id) {
      const customer = getCustomer(id);
      if (customer) {
        Object.entries(customer).forEach(([key, value]) => {
          if (key !== "id") {
            setValue(key as keyof FormValues, value);
          }
        });
      } else {
        navigate("/customers");
      }
    }
  }, [isEditMode, id, getCustomer, setValue, navigate]);

  const onSubmit = (data: FormValues) => {
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    ) as FormValues;

    if (isEditMode && id) {
      updateCustomer(id, cleanedData);
    } else {
      addCustomer(cleanedData);
    }
    navigate("/customers");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          className="mr-4"
          onClick={() => navigate("/customers")}
          icon={<ArrowLeft size={16} />}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Edit Customer" : "Add New Customer"}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Basic Information
              </h3>

              <Input
                label="Name"
                placeholder="Customer name"
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                label="Email ID"
                type="email"
                placeholder="Email address"
                error={errors.emailId?.message}
                {...register("emailId")}
              />

              <Input
                label="Phone No"
                placeholder="Phone number"
                error={errors.phoneNo?.message}
                {...register("phoneNo")}
              />
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Address Information
              </h3>

              <Input
                label="Address"
                placeholder="Street address"
                error={errors.address?.message}
                {...register("address")}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="City"
                  error={errors.city?.message}
                  {...register("city")}
                />

                <Input
                  label="State"
                  placeholder="State"
                  error={errors.state?.message}
                  {...register("state")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Country"
                  placeholder="Country"
                  error={errors.country?.message}
                  {...register("country")}
                />

                <Input
                  label="PIN Code"
                  placeholder="PIN code"
                  error={errors.pinCode?.message}
                  {...register("pinCode")}
                />
              </div>
            </div>

            {/* Tax Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900">
                Tax Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="GST No"
                  placeholder="GST number"
                  error={errors.gstNo?.message}
                  {...register("gstNo")}
                />

                <Input
                  label="PAN No"
                  placeholder="PAN number"
                  error={errors.panNo?.message}
                  {...register("panNo")}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/customers")}
            >
              Cancel
            </Button>
            <Button type="submit" icon={<Save size={16} />}>
              {isEditMode ? "Update Customer" : "Save Customer"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddCustomer;
