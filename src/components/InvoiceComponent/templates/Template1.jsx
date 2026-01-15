
import React from 'react';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';
import { numberToWords } from '../../utils/numberToWords';

const Template1 = ({ data }) => {
  const {
    billTo, shipTo, invoice, yourCompany, items, taxPercentage, taxAmount,
    subTotal, grandTotal, notes, selectedCurrency, companyLogo, signature,
    bankDetails, selectedBankAccount, qrCode, showQrCode, termsAndConditions,
    showTermsAndConditions, gstType, gstRate, sgstAmount, cgstAmount, igstAmount,
    discountType, discountValue, discountAmount, discountAppliedOn, showDiscount
  } = data;

  const selectedBank = bankDetails?.find(bank => bank.id.toString() === selectedBankAccount);

  return (
    <BaseTemplate data={data}>
      <div className="bg-white p-8 max-w-4xl mx-auto min-h-[297mm]">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8" data-pdf-section="header">
          <div className="flex items-center">
            {companyLogo && (
              <img
                src={companyLogo}
                alt="Company Logo"
                className="w-16 h-16 object-contain mr-4"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{yourCompany.name}</h1>
              <p>{yourCompany.address}</p>
              <p>{yourCompany.phone}</p>
              {(yourCompany.gstin || yourCompany.pan) && (
                <div className="text-sm text-gray-600 mt-1">
                  {yourCompany.gstin && <p>GSTIN: {yourCompany.gstin}</p>}
                  {yourCompany.pan && <p>PAN: {yourCompany.pan}</p>}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-semibold">INVOICE</h2>
            <p>Invoice Number: {invoice.number}</p>
            <p>Invoice Date: {invoice.date}</p>
            <p>Due Date: {invoice.paymentDate}</p>
          </div>
        </div>

        <div className="flex justify-between mb-8" data-pdf-section="billing">
          <div>
            <h3 className="font-semibold">Bill To:</h3>
            <p>{billTo.name}</p>
            <p>{billTo.address}</p>
            <p>{billTo.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold">Ship To:</h3>
            <p>{shipTo.name}</p>
            <p>{shipTo.address}</p>
            <p>{shipTo.phone}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-8" data-pdf-section="items">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-t border-b bg-gray-100">
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-center">HSN Code</th>
                <th className="p-2 text-center">Quantity</th>
                <th className="p-2 text-right">Unit Price</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-t-2 border-b-2 border-gray-800">
                  <td className="p-2">
                    {item.name}
                    <div className="text-sm text-gray-500">
                      {item.description}
                    </div>
                  </td>
                  <td className="p-2 text-center">{item.hsnCode || '-'}</td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 text-right">
                    {formatCurrency(item.amount, selectedCurrency)}
                  </td>
                  <td className="p-2 text-right">
                    {formatCurrency(item.total, selectedCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-8" data-pdf-section="totals">
          <div className="w-80 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subTotal, selectedCurrency)}</span>
              </div>

              {showDiscount && discountAmount > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Discount:</span>
                  <span className="font-medium">-{formatCurrency(discountAmount, selectedCurrency)}</span>
                </div>
              )}

              {gstType === "SGST_CGST" ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">SGST ({gstRate / 2}%):</span>
                    <span className="font-medium">{formatCurrency(sgstAmount, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">CGST ({gstRate / 2}%):</span>
                    <span className="font-medium">{formatCurrency(cgstAmount, selectedCurrency)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IGST ({gstRate}%):</span>
                  <span className="font-medium">{formatCurrency(igstAmount, selectedCurrency)}</span>
                </div>
              )}

              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Grand Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(grandTotal, selectedCurrency)}
                  </span>
                </div>
              </div>

              <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                <div className="text-xs text-gray-700 font-medium">Amount in words:</div>
                <div className="text-sm text-blue-800 font-medium capitalize leading-tight mt-1">
                  {numberToWords(grandTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details and QR Code Section */}
        <div className="flex justify-between mb-6" data-pdf-section="bank-details">
          <div className="flex-1 mr-8">
            {selectedBank && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Bank Details:</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Bank Name:</strong> {selectedBank.bankName}</p>
                  <p><strong>Account Number:</strong> {selectedBank.accountNumber}</p>
                  <p><strong>Account Holder:</strong> {selectedBank.accountHolderName}</p>
                  <p><strong>IFSC Code:</strong> {selectedBank.ifscCode}</p>
                  <p><strong>Branch:</strong> {selectedBank.branch}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            {showQrCode && qrCode && (
              <div>
                <h4 className="font-semibold mb-2">QR Code:</h4>
                <img src={qrCode} alt="QR Code" className="w-24 h-24 object-contain border border-gray-200" />
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        {showTermsAndConditions && termsAndConditions && (
          <div className="mb-6 border-t pt-4" data-pdf-section="terms">
            <h3 className="font-semibold mb-2">Terms & Conditions:</h3>
            <p className="text-sm text-gray-700">{termsAndConditions}</p>
          </div>
        )}

        {notes && (
          <div className="mb-6" data-pdf-section="notes">
            <h3 className="font-semibold mb-2">Notes:</h3>
            <p className="text-sm text-gray-700">{notes}</p>
          </div>
        )}

        {/* Footer Section */}
        <div className="mt-auto pt-8" data-pdf-section="signature">
          <div className="flex justify-end">
            <div className="text-right">
              {signature && (
                <div className="mb-2">
                  <img src={signature} alt="Signature" className="max-w-32 max-h-16 object-contain ml-auto" />
                </div>
              )}
              <div className="border-t border-gray-400 pt-2">
                <h4 className="font-semibold">Authorized Signature</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
};

export default Template1;
