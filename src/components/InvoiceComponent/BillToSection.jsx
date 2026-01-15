
import React from 'react';
import FloatingLabelInput from './FloatingLabelInput';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

const BillToSection = ({ billTo, handleInputChange, selectedCurrency, setSelectedCurrency, yourCompany, handleCompanyChange, companyLogo, setCompanyLogo }) => {
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setCompanyLogo(null);
  };

  return (
    <div className="mb-6">
      <div className='flex justify-between my-2'>
        {/* company logo */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Company Logo (Optional)</h3>
          <div className="flex items-center space-x-4">
            {companyLogo ? (
              <div className="relative">
                <img src={companyLogo} alt="Company Logo" className="w-20 h-20 object-contain border rounded" />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                  onClick={removeLogo}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>Upload Logo</span>
                </Button>
              </Label>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Select Currency</h3>
          <RadioGroup
            value={selectedCurrency}
            onValueChange={setSelectedCurrency}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="INR" id="inr" />
              <Label htmlFor="inr">INR (₹)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="USD" id="usd" />
              <Label htmlFor="usd">USD ($)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Bill To</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingLabelInput
          id="billToName"
          label="Name"
          value={billTo.name}
          onChange={handleInputChange}
          name="name"
        />
        <FloatingLabelInput
          id="billToPhone"
          label="Phone"
          value={billTo.phone}
          onChange={handleInputChange}
          name="phone"
        />
      </div>
      <FloatingLabelInput
        id="billToAddress"
        label="Address"
        value={billTo.address}
        onChange={handleInputChange}
        name="address"
        className="mt-4"
      />

      <div className="mb-6 mt-2">
        <h3 className="text-md font-medium mb-2">Company Tax Details (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingLabelInput
            id="companyGSTIN"
            label="GSTIN"
            value={billTo.gstin || ''}
            onChange={handleInputChange}
            name="gstin"
            placeholder="e.g., 29ABCDE1234F1Z5"
          />
          <FloatingLabelInput
            id="companyPAN"
            label="PAN"
            value={billTo.pan || ''}
            onChange={handleInputChange}
            name="pan"
            placeholder="e.g., ABCDE1234F"
          />
        </div>
      </div>


    </div>
  );
};

export default BillToSection;
