import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import FloatingLabelInput from '../components/FloatingLabelInput';
import BillToSection from '../components/BillToSection';
import ShipToSection from '../components/ShipToSection';
import ItemDetails from "../components/ItemDetails";
import { templates } from "../utils/templateRegistry";
import { FiEdit, FiFileText, FiTrash2 } from "react-icons/fi";
import { RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const generateRandomInvoiceNumber = () => {
  const length = Math.floor(Math.random() * 6) + 3;
  const alphabetCount = Math.min(Math.floor(Math.random() * 4), length);
  let result = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  for (let i = 0; i < alphabetCount; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  for (let i = alphabetCount; i < length; i++) {
    result += numbers[Math.floor(Math.random() * numbers.length)];
  }

  return result;
};

const noteOptions = [
  "Thank you for choosing us today! We hope your shopping experience was pleasant and seamless. Your satisfaction matters to us, and we look forward to serving you again soon. Keep this receipt for any returns or exchanges.",
  "Your purchase supports our community! We believe in giving back and working towards a better future. Thank you for being a part of our journey. We appreciate your trust and hope to see you again soon.",
  "We value your feedback! Help us improve by sharing your thoughts on the text message survey link. Your opinions help us serve you better and improve your shopping experience. Thank you for shopping with us!",
  "Did you know you can save more with our loyalty program? Ask about it on your next visit and earn points on every purchase. It's our way of saying thank you for being a loyal customer. See you next time!",
  "Need assistance with your purchase? We're here to help! Reach out to our customer support, or visit our website for more information. We're committed to providing you with the best service possible.",
  "Keep this receipt for returns or exchanges.",
  "Every purchase makes a difference! We are dedicated to eco-friendly practices and sustainability. Thank you for supporting a greener planet with us. Together, we can build a better tomorrow.",
  "Have a great day!",
  "Thank you for shopping with us today. Did you know you can return or exchange your items within 30 days with this receipt? We want to ensure that you're happy with your purchase, so don't hesitate to come back if you need assistance.",
  "Eco-friendly business. This receipt is recyclable.",
  "We hope you enjoyed your shopping experience! Remember, for every friend you refer, you can earn exclusive rewards. Visit www.example.com/refer for more details. We look forward to welcoming you back soon!",
  "Thank you for choosing us! We appreciate your business and look forward to serving you again. Keep this receipt for any future inquiries or returns.",
  "Your purchase supports local businesses and helps us continue our mission. Thank you for being a valued customer. We hope to see you again soon!",
  "We hope you had a great shopping experience today. If you have any feedback, please share it with us on our website. We are always here to assist you.",
  "Thank you for your visit! Remember, we offer exclusive discounts to returning customers. Check your email for special offers on your next purchase.",
  "Your satisfaction is our top priority. If you need any help or have questions about your purchase, don't hesitate to contact us. Have a great day!",
  "We love our customers! Thank you for supporting our business. Follow us on social media for updates on promotions and new products. See you next time!",
  "Every purchase counts! We are committed to making a positive impact, and your support helps us achieve our goals. Thank you for shopping with us today!",
  "We hope you found everything you needed. If not, please let us know so we can improve your experience. Your feedback helps us serve you better. Thank you!",
  "Thank you for visiting! Did you know you can save more with our rewards program? Ask about it during your next visit and start earning points today!",
  "We appreciate your trust in us. If you ever need assistance with your order, please visit our website or call customer service. We're here to help!",
];

const Index = () => {
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [billTo, setBillTo] = useState({ name: "", address: "", phone: "", gstin: "", pan: "" });
  const [shipTo, setShipTo] = useState({ name: "", address: "", phone: "" });
  const [invoice, setInvoice] = useState({
    date: "",
    paymentDate: "",
    number: "",
  });
  const [yourCompany, setYourCompany] = useState({
    name: "",
    address: "",
    phone: "",
    gstin: "",
    pan: "",
  });
  const [companyLogo, setCompanyLogo] = useState(null);
  const [items, setItems] = useState([]);
  const [taxPercentage, settaxPercentage] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [notes, setNotes] = useState("");
  const [signature, setSignature] = useState(null);
  const [bankDetails, setBankDetails] = useState([]);
  const [selectedBankAccount, setSelectedBankAccount] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);

  // New GST and Discount features
  const [gstType, setGstType] = useState("SGST_CGST"); // SGST_CGST or IGST
  const [gstRate, setGstRate] = useState(18); // Default 18%
  const [sgstAmount, setSgstAmount] = useState(0);
  const [cgstAmount, setCgstAmount] = useState(0);
  const [igstAmount, setIgstAmount] = useState(0);
  const [discountType, setDiscountType] = useState("value"); // percentage or value
  const [discountValue, setDiscountValue] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountAppliedOn, setDiscountAppliedOn] = useState("beforeTax"); // beforeTax or afterTax
  const [showDiscount, setShowDiscount] = useState(false);

  const refreshNotes = () => {
    const randomIndex = Math.floor(Math.random() * noteOptions.length);
    setNotes(noteOptions[randomIndex]);
  };

  useEffect(() => {
    // Load form data from localStorage on component mount
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setBillTo(parsedData.billTo || { name: "", address: "", phone: "" });
      setShipTo(parsedData.shipTo || { name: "", address: "", phone: "" });
      setInvoice(
        parsedData.invoice || { date: "", paymentDate: "", number: "" }
      );
      setYourCompany(
        parsedData.yourCompany || { name: "", address: "", phone: "", gstin: "", pan: "" }
      );
      setCompanyLogo(parsedData.companyLogo || null);
      setItems(parsedData.items || []);
      settaxPercentage(parsedData.taxPercentage || 0);
      setNotes(parsedData.notes || "");
      setSelectedCurrency(parsedData.selectedCurrency || "INR");
      setSignature(parsedData.signature || null);
      setBankDetails(parsedData.bankDetails || []);
      setSelectedBankAccount(parsedData.selectedBankAccount || "");
      setQrCode(parsedData.qrCode || null);
      setShowQrCode(parsedData.showQrCode || false);
      setTermsAndConditions(parsedData.termsAndConditions || "");
      setShowTermsAndConditions(parsedData.showTermsAndConditions || false);

      // Load new GST and discount data
      setGstType(parsedData.gstType || "SGST_CGST");
      setGstRate(parsedData.gstRate || 18);
      setDiscountType(parsedData.discountType || "value");
      setDiscountValue(parsedData.discountValue || 0);
      setDiscountAppliedOn(parsedData.discountAppliedOn || "beforeTax");
      setShowDiscount(parsedData.showDiscount || false);
    } else {
      // If no saved data, set invoice number
      setInvoice((prev) => ({
        ...prev,
        number: generateRandomInvoiceNumber(),
      }));
    }
  }, []);

  useEffect(() => {
    // Save form data to localStorage whenever it changes
    const formData = {
      billTo,
      shipTo,
      invoice,
      yourCompany,
      companyLogo,
      items,
      taxPercentage,
      taxAmount,
      subTotal,
      grandTotal,
      notes,
      selectedCurrency,
      signature,
      bankDetails,
      selectedBankAccount,
      qrCode,
      showQrCode,
      termsAndConditions,
      showTermsAndConditions,
      gstType,
      gstRate,
      sgstAmount,
      cgstAmount,
      igstAmount,
      discountType,
      discountValue,
      discountAmount,
      discountAppliedOn,
      showDiscount,
    };
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [
    billTo,
    shipTo,
    invoice,
    yourCompany,
    companyLogo,
    items,
    taxPercentage,
    notes,
    taxAmount,
    subTotal,
    grandTotal,
    selectedCurrency,
    signature,
    bankDetails,
    selectedBankAccount,
    qrCode,
    showQrCode,
    termsAndConditions,
    showTermsAndConditions,
    gstType,
    gstRate,
    sgstAmount,
    cgstAmount,
    igstAmount,
    discountType,
    discountValue,
    discountAmount,
    discountAppliedOn,
    showDiscount,
  ]);

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === "quantity" || field === "amount") {
      newItems[index].total = newItems[index].quantity * newItems[index].amount;
    }
    setItems(newItems);
    updateTotals();
  };

  const addItem = () => {
    setItems([
      ...items,
      { name: "", description: "", quantity: 0, amount: 0, total: 0, hsnCode: "" },
    ]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateSubTotal = () => {
    const calculatedSubTotal = items.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
    setSubTotal(calculatedSubTotal);
    return calculatedSubTotal;
  };

  const calculateDiscountAmount = (subTotalValue) => {
    let discount = 0;
    if (showDiscount) {
      if (discountType === "percentage") {
        discount = (subTotalValue * discountValue) / 100;
      } else {
        discount = discountValue;
      }
    }
    setDiscountAmount(discount);
    return discount;
  };

  const calculateGSTAmounts = (taxableAmount) => {
    if (gstType === "SGST_CGST") {
      const sgst = (taxableAmount * (gstRate / 2)) / 100;
      const cgst = (taxableAmount * (gstRate / 2)) / 100;
      setSgstAmount(sgst);
      setCgstAmount(cgst);
      setIgstAmount(0);
      setTaxAmount(sgst + cgst);
      return sgst + cgst;
    } else {
      const igst = (taxableAmount * gstRate) / 100;
      setIgstAmount(igst);
      setSgstAmount(0);
      setCgstAmount(0);
      setTaxAmount(igst);
      return igst;
    }
  };

  const calculateGrandTotal = (subTotalValue, discountAmountValue, taxAmountValue) => {
    let taxableAmount = subTotalValue;

    if (discountAppliedOn === "beforeTax") {
      taxableAmount = subTotalValue - discountAmountValue;
    }

    const finalTaxAmount = calculateGSTAmounts(taxableAmount);

    let total = subTotalValue - discountAmountValue + finalTaxAmount;

    if (discountAppliedOn === "afterTax") {
      total = subTotalValue + finalTaxAmount - discountAmountValue;
    }

    setGrandTotal(total);
    return total;
  };

  const updateTotals = () => {
    const currentSubTotal = calculateSubTotal();
    const currentDiscountAmount = calculateDiscountAmount(currentSubTotal);
    calculateGrandTotal(currentSubTotal, currentDiscountAmount, 0);
  };

  const handleGstRateChange = (e) => {
    const rate = parseFloat(e.target.value) || 0;
    setGstRate(rate);
  };

  const handleDiscountValueChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDiscountValue(value);
  };

  useEffect(() => {
    updateTotals();
  }, [items, gstRate, gstType, discountType, discountValue, discountAppliedOn, showDiscount]);

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSignature(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleQrCodeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setQrCode(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const addBankAccount = () => {
    const newAccount = {
      id: Date.now(),
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      ifscCode: "",
      branch: "",
    };
    setBankDetails([...bankDetails, newAccount]);
  };

  const updateBankAccount = (id, field, value) => {
    setBankDetails(bankDetails.map(account =>
      account.id === id ? { ...account, [field]: value } : account
    ));
  };

  const removeBankAccount = (id) => {
    setBankDetails(bankDetails.filter(account => account.id !== id));
    if (selectedBankAccount === id.toString()) {
      setSelectedBankAccount("");
    }
  };

  const handleTemplateClick = (templateNumber) => {
    const formData = {
      billTo,
      shipTo,
      invoice,
      yourCompany,
      companyLogo,
      items,
      taxPercentage,
      taxAmount,
      subTotal,
      grandTotal,
      notes,
      selectedCurrency,
      signature,
      bankDetails,
      selectedBankAccount,
      qrCode,
      showQrCode,
      termsAndConditions,
      showTermsAndConditions,
      gstType,
      gstRate,
      sgstAmount,
      cgstAmount,
      igstAmount,
      discountType,
      discountValue,
      discountAmount,
      discountAppliedOn,
      showDiscount,
    };
    navigate("/template", {
      state: { formData, selectedTemplate: templateNumber },
    });
  };

  const fillDummyData = () => {
    setBillTo({
      name: "John Doe",
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
    });
    setShipTo({
      name: "Jane Smith",
      address: "456 Elm St, Othertown, USA",
      phone: "(555) 987-6543",
    });
    setInvoice({
      date: new Date().toISOString().split("T")[0],
      paymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      number: generateRandomInvoiceNumber(),
    });
    setYourCompany({
      name: "Your Company",
      address: "789 Oak St, Businessville, USA",
      phone: "(555) 555-5555",
      gstin: "29ABCDE1234F1Z5",
      pan: "ABCDE1234F",
    });
    setItems([
      {
        name: "Product A",
        description: "High-quality item",
        quantity: 2,
        amount: 50,
        total: 100,
        hsnCode: "1234",
      },
      {
        name: "Service B",
        description: "Professional service",
        quantity: 1,
        amount: 200,
        total: 200,
        hsnCode: "5678",
      },
    ]);
    setGstRate(18);
    setDiscountValue(10);
    setShowDiscount(true);
    calculateSubTotal();
    setNotes("Thank you for your business!");
    setSignature(null);
    setBankDetails([
      {
        id: 1,
        bankName: "State Bank of India",
        accountNumber: "1234567890",
        accountHolderName: "Your Company",
        ifscCode: "SBIN0001234",
        branch: "Main Branch",
      }
    ]);
    setSelectedBankAccount("1");
    //setQrCode(null);
    // setShowQrCode(false);
    setTermsAndConditions("Payment is due within 30 days. Late payments may incur additional charges.");
    setShowTermsAndConditions(true);
  };

  const clearForm = () => {
    setBillTo({ name: "", address: "", phone: "" });
    setShipTo({ name: "", address: "", phone: "" });
    setInvoice({
      date: "",
      paymentDate: "",
      number: generateRandomInvoiceNumber(),
    });
    // setYourCompany({ name: "", address: "", phone: "", gstin: "", pan: "" });
    // setCompanyLogo(null);
    setItems([{ name: "", description: "", quantity: 0, amount: 0, total: 0, hsnCode: "" }]);
    settaxPercentage(0);
    // setNotes("");
    // setSignature(null);
    // setBankDetails([]);
    // setSelectedBankAccount("");
    // setQrCode(null);
    // setShowQrCode(false);
    // setTermsAndConditions("");
    setShowTermsAndConditions(false);
    setGstType("SGST_CGST");
    setGstRate(18);
    setDiscountType("value");
    setDiscountValue(0);
    setDiscountAppliedOn("beforeTax");
    setShowDiscount(false);
    localStorage.removeItem("formData");
  };

  const removeSignature = () => {
    setSignature(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-3xl font-bold mb-8 text-center">Get My Bill</h1>

      {/* Fixed buttons */}
      <div className="fixed top-4 left-4 flex gap-2">
        <Tooltip>
          <TooltipTrigger>
            <button
              onClick={clearForm}
              className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600"
              aria-label="Clear Form"
            >
              <FiTrash2 size={24} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Clear the Biller Form
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <button
              onClick={fillDummyData}
              className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
              aria-label="Fill with Dummy Data"
            >
              <FiEdit size={24} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Fill the form with dummy data
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Receipt button */}
      <div className="fixed top-4 right-8 flex gap-2">
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="secondary"
              className="bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600"
              aria-label="Switch to Receipt"
              onClick={() =>
                navigate("/receipt", {
                  state: {
                    formData: {
                      billTo,
                      shipTo,
                      invoice,
                      yourCompany,
                      companyLogo,
                      items,
                      taxPercentage,
                      notes,
                      selectedCurrency,
                      signature,
                      bankDetails,
                      selectedBankAccount,
                      qrCode,
                      showQrCode,
                      termsAndConditions,
                      showTermsAndConditions,
                      gstType,
                      gstRate,
                      sgstAmount,
                      cgstAmount,
                      igstAmount,
                      discountType,
                      discountValue,
                      discountAmount,
                      discountAppliedOn,
                      showDiscount,
                    },
                  },
                })
              }
            >
              <FiFileText size={24} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Switch to Receipt
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-md">
          <form>

            {/* Your Company */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Your Company</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingLabelInput
                  id="yourCompanyName"
                  label="Name"
                  value={yourCompany.name}
                  onChange={handleInputChange(setYourCompany)}
                  name="name"
                />
                <FloatingLabelInput
                  id="yourCompanyPhone"
                  label="Phone"
                  value={yourCompany.phone}
                  onChange={handleInputChange(setYourCompany)}
                  name="phone"
                />
                <FloatingLabelInput
                  id="yourCompanyGstin"
                  label="GSTIN"
                  value={yourCompany.gstin}
                  onChange={handleInputChange(setYourCompany)}
                  name="gstin"
                />
                <FloatingLabelInput
                  id="yourCompanyPan"
                  label="PAN"
                  value={yourCompany.pan}
                  onChange={handleInputChange(setYourCompany)}
                  name="pan"
                />
              </div>
              <FloatingLabelInput
                id="yourCompanyAddress"
                label="Address"
                value={yourCompany.address}
                onChange={handleInputChange(setYourCompany)}
                name="address"
                className="mt-4"
              />
            </div>

            {/* Company and Invoice sections */}
            <BillToSection
              billTo={billTo}
              handleInputChange={handleInputChange(setBillTo)}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
              yourCompany={yourCompany}
              handleCompanyChange={handleInputChange(setYourCompany)}
              companyLogo={companyLogo}
              setCompanyLogo={setCompanyLogo}
            />

            <ShipToSection
              shipTo={shipTo}
              handleInputChange={handleInputChange(setShipTo)}
              billTo={billTo}
            />

            {/* Invoice Information */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Invoice Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FloatingLabelInput
                  id="invoiceNumber"
                  label="Invoice Number"
                  value={invoice.number}
                  onChange={handleInputChange(setInvoice)}
                  name="number"
                />
                <FloatingLabelInput
                  id="invoiceDate"
                  label="Invoice Date"
                  type="date"
                  value={invoice.date}
                  onChange={handleInputChange(setInvoice)}
                  name="date"
                />
                <FloatingLabelInput
                  id="paymentDate"
                  label="Payment Date"
                  type="date"
                  value={invoice.paymentDate}
                  onChange={handleInputChange(setInvoice)}
                  name="paymentDate"
                />
              </div>
            </div>


            <ItemDetails
              items={items}
              handleItemChange={handleItemChange}
              addItem={addItem}
              removeItem={removeItem}
            />

            {/* GST Configuration */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">GST Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">GST Type:</label>
                  <select
                    value={gstType}
                    onChange={(e) => setGstType(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="SGST_CGST">SGST + CGST</option>
                    <option value="IGST">IGST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GST Rate (%):</label>
                  <input
                    type="number"
                    value={gstRate}
                    onChange={handleGstRateChange}
                    className="w-full p-2 border rounded"
                    min="0"
                    max="28"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Discount Configuration */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="showDiscount"
                  checked={showDiscount}
                  onChange={(e) => setShowDiscount(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="showDiscount" className="text-lg font-medium">Apply Discount</label>
              </div>

              {showDiscount && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Discount Type:</label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="value">Fixed Amount</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Discount {discountType === "percentage" ? "(%)" : "(₹)"}:
                    </label>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={handleDiscountValueChange}
                      className="w-full p-2 border rounded"
                      min="0"
                      step={discountType === "percentage" ? "0.1" : "1"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Apply On:</label>
                    <select
                      value={discountAppliedOn}
                      onChange={(e) => setDiscountAppliedOn(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="beforeTax">Before Tax</option>
                      <option value="afterTax">After Tax</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Totals Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Totals</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sub Total:</span>
                  <span>{formatCurrency(subTotal, selectedCurrency)}</span>
                </div>

                {showDiscount && discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(discountAmount, selectedCurrency)}</span>
                  </div>
                )}

                {gstType === "SGST_CGST" ? (
                  <>
                    <div className="flex justify-between">
                      <span>SGST ({gstRate / 2}%):</span>
                      <span>{formatCurrency(sgstAmount, selectedCurrency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CGST ({gstRate / 2}%):</span>
                      <span>{formatCurrency(cgstAmount, selectedCurrency)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>IGST ({gstRate}%):</span>
                    <span>{formatCurrency(igstAmount, selectedCurrency)}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(grandTotal, selectedCurrency)}</span>
                </div>
              </div>
            </div>

            {/* Notes section */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-medium">Notes</h3>
                <button
                  type="button"
                  onClick={refreshNotes}
                  className="ml-2 p-1 rounded-full hover:bg-gray-200"
                  title="Refresh Notes"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded"
                rows="4"
              ></textarea>
            </div>

            {/* Signature Upload Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Signature (Optional)</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleSignatureUpload}
                className="w-full p-2 border rounded"
              />
              {signature && (

                <div className="mt-2 relative flex items-center space-x-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                    onClick={removeSignature}
                  >
                    <X className="w-3 h-3" />
                  </Button>

                  <img src={signature} alt="Signature" className="max-w-32 max-h-16 object-contain" />
                </div>
              )}
            </div>

            {/* Bank Details Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Bank Details</h3>
                <button
                  type="button"
                  onClick={addBankAccount}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Add Bank Account
                </button>
              </div>

              {bankDetails.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Select Bank Account for Invoice:</label>
                  <select
                    value={selectedBankAccount}
                    onChange={(e) => setSelectedBankAccount(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">No bank details</option>
                    {bankDetails.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.bankName} - {account.accountNumber}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {bankDetails.map((account) => (
                <div key={account.id} className="border p-4 rounded mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Bank Account</h4>
                    <button
                      type="button"
                      onClick={() => removeBankAccount(account.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingLabelInput
                      id={`bankName-${account.id}`}
                      label="Bank Name"
                      value={account.bankName}
                      onChange={(e) => updateBankAccount(account.id, 'bankName', e.target.value)}
                    />
                    <FloatingLabelInput
                      id={`accountNumber-${account.id}`}
                      label="Account Number"
                      value={account.accountNumber}
                      onChange={(e) => updateBankAccount(account.id, 'accountNumber', e.target.value)}
                    />
                    <FloatingLabelInput
                      id={`accountHolderName-${account.id}`}
                      label="Account Holder Name"
                      value={account.accountHolderName}
                      onChange={(e) => updateBankAccount(account.id, 'accountHolderName', e.target.value)}
                    />
                    <FloatingLabelInput
                      id={`ifscCode-${account.id}`}
                      label="IFSC Code"
                      value={account.ifscCode}
                      onChange={(e) => updateBankAccount(account.id, 'ifscCode', e.target.value)}
                    />
                    <FloatingLabelInput
                      id={`branch-${account.id}`}
                      label="Branch"
                      value={account.branch}
                      onChange={(e) => updateBankAccount(account.id, 'branch', e.target.value)}
                      className="md:col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* QR Code Section */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="showQrCode"
                  checked={showQrCode}
                  onChange={(e) => setShowQrCode(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="showQrCode" className="text-lg font-medium">Show QR Code</label>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleQrCodeUpload}
                className="w-full p-2 border rounded"
              />
              {qrCode && (
                <div className="mt-2">
                  <img src={qrCode} alt="QR Code" className="max-w-32 max-h-32 object-contain" />
                </div>
              )}
            </div>

            {/* Terms and Conditions Section */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="showTermsAndConditions"
                  checked={showTermsAndConditions}
                  onChange={(e) => setShowTermsAndConditions(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="showTermsAndConditions" className="text-lg font-medium">Show Terms & Conditions</label>
              </div>
              <textarea
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                placeholder="Enter your terms and conditions..."
                className="w-full p-2 border rounded"
                rows="4"
              />
            </div>
          </form>
        </div>

        {/* Template Gallery - Updated to 2 columns */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4">Template Gallery</h2>
          <div className="grid grid-cols-2 gap-4">
            {templates.map((template, index) => (
              <div
                key={index}
                className="template-card bg-gray-100 p-4 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => handleTemplateClick(index + 1)}
              >
                <img
                  src={`/assets/template${index + 1}-preview.png`}
                  alt={template.name}
                  className={`w-full ${template.name === "Template 10"
                    ? "h-[38px] w-[57px]"
                    : "h-50"
                    } object-cover rounded mb-2`}
                  onError={(e) => {
                    // Fallback to a simple colored div if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div
                  className="w-full h-50 bg-gradient-to-r from-blue-400 to-blue-600 rounded mb-2 flex items-center justify-center text-white font-bold text-xs"
                  style={{ display: 'none' }}
                >
                  {index + 1}
                </div>
                <p className="text-center font-medium text-sm">{template.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
