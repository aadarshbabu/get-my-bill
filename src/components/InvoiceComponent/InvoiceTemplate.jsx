
import React from 'react';
import { getTemplate } from '../utils/templateRegistry';

const InvoiceTemplate = ({ data, templateNumber }) => {
  const Template = getTemplate(templateNumber);
  
  // Ensure all new fields are included in the data passed to templates
  const enhancedData = {
    ...data,
    signature: data.signature || null,
    bankDetails: data.bankDetails || [],
    selectedBankAccount: data.selectedBankAccount || "",
    qrCode: data.qrCode || null,
    showQrCode: data.showQrCode || false,
    termsAndConditions: data.termsAndConditions || "",
    showTermsAndConditions: data.showTermsAndConditions || false,
    gstType: data.gstType || "SGST_CGST",
    gstRate: data.gstRate || 18,
    sgstAmount: data.sgstAmount || 0,
    cgstAmount: data.cgstAmount || 0,
    igstAmount: data.igstAmount || 0,
    discountType: data.discountType || "value",
    discountValue: data.discountValue || 0,
    discountAmount: data.discountAmount || 0,
    discountAppliedOn: data.discountAppliedOn || "beforeTax",
    showDiscount: data.showDiscount || false,
  };
  
  return <Template data={enhancedData} />;
};

export default InvoiceTemplate;
