
import React from 'react';
import { format } from 'date-fns';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';
import { numberToWords } from '../../utils/numberToWords';

const Template10 = ({ data }) => {
  const {
    billTo = {}, shipTo = {}, invoice = {}, yourCompany = {}, items = [],
    taxPercentage = 0, taxAmount = 0, subTotal = 0, grandTotal = 0, notes = '',
    selectedCurrency, companyLogo, signature, bankDetails, selectedBankAccount,
    qrCode, showQrCode, termsAndConditions, showTermsAndConditions, gstType,
    gstRate, sgstAmount, cgstAmount, igstAmount, discountType, discountValue,
    discountAmount, discountAppliedOn, showDiscount
  } = data || {};

  const selectedBank = bankDetails?.find(bank => bank.id.toString() === selectedBankAccount);

  return (
    <BaseTemplate data={data}>
      <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-full">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 relative overflow-hidden" data-pdf-section="header">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center">
              {companyLogo && (
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  className="w-16 h-16 object-contain mr-4 bg-white rounded-lg p-2"
                />
              )}
              <div>
                <h1 className="text-4xl font-bold mb-2">INVOICE</h1>
                <h2 className="text-xl font-medium opacity-90">
                  {yourCompany.name || "Your Company Name"}
                </h2>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                <p className="mb-1">
                  <span className="font-semibold">Invoice #:</span> {invoice.number || "N/A"}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Date:</span>{" "}
                  {invoice.date ? format(new Date(invoice.date), "MMM dd, yyyy") : "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Due Date:</span>{" "}
                  {invoice.paymentDate ? format(new Date(invoice.paymentDate), "MMM dd, yyyy") : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Company and billing info */}
          <div className="grid grid-cols-2 gap-8 mb-8" data-pdf-section="billing">
            <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
              <h3 className="text-lg font-semibold text-purple-600 mb-3 flex items-center">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                From
              </h3>
              <div className="text-gray-700">
                <p className="font-medium">{yourCompany.name || "Your Company Name"}</p>
                <p>{yourCompany.address || "Company Address"}</p>
                <p>{yourCompany.phone || "Company Phone"}</p>
                {(yourCompany.gstin || yourCompany.pan) && (
                  <div className="text-sm text-gray-600 mt-2">
                    {yourCompany.gstin && <p>GSTIN: {yourCompany.gstin}</p>}
                    {yourCompany.pan && <p>PAN: {yourCompany.pan}</p>}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                Bill To
              </h3>
              <div className="text-gray-700">
                <p className="font-medium">{billTo.name || "Client Name"}</p>
                <p>{billTo.address || "Client Address"}</p>
                <p>{billTo.phone || "Client Phone"}</p>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div className="mb-8" data-pdf-section="items">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    <th className="p-4 text-left font-medium">Description</th>
                    <th className="p-4 text-center font-medium">HSN</th>
                    <th className="p-4 text-right font-medium">Qty</th>
                    <th className="p-4 text-right font-medium">Rate</th>
                    <th className="p-4 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-50 ${index % 2 === 0 ? "bg-gray-25" : "bg-white"}`}
                    >
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{item.name || "Item Name"}</p>
                        <p className="text-sm text-gray-500">{item.description || ""}</p>
                      </td>
                      <td className="p-4 text-center text-gray-600">{item.hsnCode || '-'}</td>
                      <td className="p-4 text-right text-gray-600">{item.quantity || 0}</td>
                      <td className="p-4 text-right text-gray-600">
                        {formatCurrency(item.amount || 0, selectedCurrency)}
                      </td>
                      <td className="p-4 text-right font-medium text-gray-900">
                        {formatCurrency((item.quantity || 0) * (item.amount || 0), selectedCurrency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals section */}
          <div className="flex justify-end mb-8" data-pdf-section="totals">
            <div className="w-1/2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subTotal, selectedCurrency)}</span>
                  </div>
                  {showDiscount && discountAmount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>Discount:</span>
                      <span>-{formatCurrency(discountAmount, selectedCurrency)}</span>
                    </div>
                  )}
                  {gstType === "SGST_CGST" ? (
                    <>
                      <div className="flex justify-between text-gray-600">
                        <span>SGST ({gstRate / 2}%):</span>
                        <span>{formatCurrency(sgstAmount, selectedCurrency)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>CGST ({gstRate / 2}%):</span>
                        <span>{formatCurrency(cgstAmount, selectedCurrency)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-gray-600">
                      <span>IGST ({gstRate}%):</span>
                      <span>{formatCurrency(igstAmount, selectedCurrency)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total:</span>
                      <span className="text-purple-600">
                        {formatCurrency(grandTotal, selectedCurrency)}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 capitalize mt-3">
                    <strong>Amount in words:</strong> {numberToWords(grandTotal)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details and QR Code */}
          {(selectedBank || (showQrCode && qrCode)) && (
            <div className="flex justify-between gap-8 mb-6" data-pdf-section="bank-details">
              {selectedBank && (
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Bank Details</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Bank:</strong> {selectedBank.bankName}</p>
                    <p><strong>Account:</strong> {selectedBank.accountNumber}</p>
                    <p><strong>Holder:</strong> {selectedBank.accountHolderName}</p>
                    <p><strong>IFSC:</strong> {selectedBank.ifscCode}</p>
                    <p><strong>Branch:</strong> {selectedBank.branch}</p>
                  </div>
                </div>
              )}
              {showQrCode && qrCode && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                  <h4 className="font-semibold text-gray-900 mb-3">QR Payment</h4>
                  <img src={qrCode} alt="QR Code" className="w-24 h-24 object-contain mx-auto" />
                </div>
              )}
            </div>
          )}

          {/* Terms and Conditions */}
          {showTermsAndConditions && termsAndConditions && (
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6" data-pdf-section="terms">
              <h3 className="font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
              <p className="text-sm text-gray-600">{termsAndConditions}</p>
            </div>
          )}

          {notes && (
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6" data-pdf-section="notes">
              <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
              <p className="text-gray-600">{notes}</p>
            </div>
          )}

          {/* Signature */}
          <div className="flex justify-end" data-pdf-section="signature">
            <div className="text-right bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {signature && (
                <div className="mb-3">
                  <img src={signature} alt="Signature" className="max-w-32 max-h-16 object-contain ml-auto" />
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <h4 className="font-semibold text-gray-900">Authorized Signature</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
};

export default Template10;
