import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import SignatureCanvas from "react-signature-canvas";
import { Save, RefreshCw, Upload } from "lucide-react";

const Settings: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [signature, setSignature] = useState<SignatureCanvas | null>(null);
  const [signatureURL, setSignatureURL] = useState<string>(
    settings.signature || ""
  );
  const [businessLogo, setBusinessLogo] = useState<string>(
    settings.businessLogo || ""
  );
  const [taxRates, setTaxRates] = useState({
    CGST: settings.taxRate.CGST,
    SGST: settings.taxRate.SGST,
  });
  const [businessInfo, setBusinessInfo] = useState({
    businessName: settings.businessName,
    businessAddress: settings.businessAddress,
    businessEmail: settings.businessEmail,
    businessPhone: settings.businessPhone,
  });

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
    }
  };

  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTaxRates((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBusinessLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = () => {
    updateSettings({
      ...businessInfo,
      signature: signatureURL,
      businessLogo,
      taxRate: taxRates,
    });

    alert("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Information */}
        <Card title="Business Information">
          <div className="space-y-4">
            <Input
              label="Business Name"
              name="businessName"
              value={businessInfo.businessName}
              onChange={handleBusinessInfoChange}
            />

            <Input
              label="Business Address"
              name="businessAddress"
              value={businessInfo.businessAddress}
              onChange={handleBusinessInfoChange}
            />

            <Input
              label="Business Email"
              name="businessEmail"
              type="email"
              value={businessInfo.businessEmail}
              onChange={handleBusinessInfoChange}
            />

            <Input
              label="Business Phone"
              name="businessPhone"
              value={businessInfo.businessPhone}
              onChange={handleBusinessInfoChange}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Business Logo
              </label>
              <div className="flex items-center space-x-4">
                {businessLogo && (
                  <div className="w-16 h-16 border rounded overflow-hidden">
                    <img
                      src={businessLogo}
                      alt="Business Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                  <Upload size={16} />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Tax Settings */}
        <Card title="Tax Settings">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="CGST (%)"
                name="CGST"
                type="number"
                value={taxRates.CGST.toString()}
                onChange={handleTaxRateChange}
              />

              <Input
                label="SGST (%)"
                name="SGST"
                type="number"
                value={taxRates.SGST.toString()}
                onChange={handleTaxRateChange}
              />
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-600 mb-2">
                These tax rates will be used as defaults when creating new
                invoices.
              </p>
            </div>
          </div>
        </Card>

        {/* Digital Signature */}
        <Card title="Digital Signature" className="md:col-span-2">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Draw your signature below. This will be used on your invoices.
            </p>

            <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
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
              <Button
                type="button"
                variant="outline"
                onClick={clearSignature}
                icon={<RefreshCw size={16} />}
              >
                Clear
              </Button>

              <Button type="button" onClick={saveSignature}>
                Save Signature
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={saveSettings} icon={<Save size={20} />} size="lg">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
