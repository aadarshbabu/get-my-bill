import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Printer, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import InvoiceTemplate from '../components/InvoiceTemplate';
import { generatePDF, printInvoice } from '../utils/pdfGenerator';
import { templates } from '../utils/templateRegistry';

const TemplatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.formData) {
      const enhancedFormData = {
        ...location.state.formData,
        signature: location.state.formData.signature || null,
        bankDetails: location.state.formData.bankDetails || [],
        selectedBankAccount: location.state.formData.selectedBankAccount || "",
        qrCode: location.state.formData.qrCode || null,
        showQrCode: location.state.formData.showQrCode || false,
        termsAndConditions: location.state.formData.termsAndConditions || "",
        showTermsAndConditions: location.state.formData.showTermsAndConditions || false,
        gstType: location.state.formData.gstType || "SGST_CGST",
        gstRate: location.state.formData.gstRate || 18,
        sgstAmount: location.state.formData.sgstAmount || 0,
        cgstAmount: location.state.formData.cgstAmount || 0,
        igstAmount: location.state.formData.igstAmount || 0,
        discountType: location.state.formData.discountType || "value",
        discountValue: location.state.formData.discountValue || 0,
        discountAmount: location.state.formData.discountAmount || 0,
        discountAppliedOn: location.state.formData.discountAppliedOn || "beforeTax",
        showDiscount: location.state.formData.showDiscount || false,
      };
      setFormData(enhancedFormData);
      setCurrentTemplate(location.state.selectedTemplate || 1);
    } else {
      // If no form data in location state, try to load from localStorage
      const savedFormData = localStorage.getItem('formData');
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        const enhancedFormData = {
          ...parsedData,
          signature: parsedData.signature || null,
          bankDetails: parsedData.bankDetails || [],
          selectedBankAccount: parsedData.selectedBankAccount || "",
          qrCode: parsedData.qrCode || null,
          showQrCode: parsedData.showQrCode || false,
          termsAndConditions: parsedData.termsAndConditions || "",
          showTermsAndConditions: parsedData.showTermsAndConditions || false,
          gstType: parsedData.gstType || "SGST_CGST",
          gstRate: parsedData.gstRate || 18,
          sgstAmount: parsedData.sgstAmount || 0,
          cgstAmount: parsedData.cgstAmount || 0,
          igstAmount: parsedData.igstAmount || 0,
          discountType: parsedData.discountType || "value",
          discountValue: parsedData.discountValue || 0,
          discountAmount: parsedData.discountAmount || 0,
          discountAppliedOn: parsedData.discountAppliedOn || "beforeTax",
          showDiscount: parsedData.showDiscount || false,
        };
        setFormData(enhancedFormData);
      }
    }
  }, [location.state]);

  const handleTemplateChange = (templateNumber) => {
    setCurrentTemplate(templateNumber);
  };

  const handleDownloadPDF = async () => {
    if (formData && !isDownloading) {
      setIsDownloading(true);
      try {
        await generatePDF(formData, currentTemplate);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handlePrintInvoice = () => {
    printInvoice();
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  // Calculate if content needs multiple pages for preview with improved logic
  const hasMultipleItems = formData.items && formData.items.length >= 200;
  const hasBankDetails = formData.bankDetails && formData.selectedBankAccount;
  const hasTermsAndConditions = formData.termsAndConditions && formData.showTermsAndConditions;
  const hasSignature = formData.signature;

  // Check if we have footer content that should be on second page
  const hasFooterContent = hasBankDetails || hasTermsAndConditions || hasSignature;
  const showMultiPagePreview = hasMultipleItems

  return (
    <div className="container mx-auto px-4 py-8">
      <TooltipProvider>
        <div className="flex justify-between items-center mb-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go back to invoice form</p>
            </TooltipContent>
          </Tooltip>

          <div className="flex gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download invoice as PDF file</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Template Selection - Text Only Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Choose Template Design</h3>
          <div className="flex flex-wrap gap-2">
            {templates.map((template, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant={currentTemplate === index + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTemplateChange(index + 1)}
                    className={`${currentTemplate === index + 1 
                      ? "bg-blue-500 hover:bg-blue-600" 
                      : "hover:bg-gray-100"
                    }`}
                  >
                    {template.name}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select {template.name} design</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-scroll border">
          {showMultiPagePreview ? (
            <div className="space-y-8">
              {/* First Page Preview */}
              <div
                className="invoice-container bg-white"
                style={{
                  width: '310mm',
                  minHeight: '297mm',
                  margin: '0 auto',
                  overflow: 'hidden',
                  pageBreakInside: 'avoid',
                  padding: '10mm'
                }}
              >
                <InvoiceTemplate data={formData} templateNumber={currentTemplate} />
              </div>
            </div>
          ) : (
            <div
              className="invoice-container"
              style={{
                width: '310mm',
                minHeight: '297mm',
                margin: '0 auto',
                overflow: 'visible',
                pageBreakInside: 'avoid',
                padding: '10mm'
              }}
            >
              <InvoiceTemplate data={formData} templateNumber={currentTemplate} />
            </div>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default TemplatePage;
