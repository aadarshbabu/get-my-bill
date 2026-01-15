
import React from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/formatCurrency';
import { numberToWords } from '../../utils/numberToWords';
import BaseTemplate from './BaseTemplate';

const Template13 = ({ data }) => {
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
      <div className="bg-white min-h-screen p-4 max-w-4xl mx-auto">
        {/* Bold Red Header */}
        <div
          className="text-white p-4 mb-8"
          style={{ background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)' }}

        >
          <div className="flex justify-between items-start" data-pdf-section="header">
            <div className="flex items-center">
              {companyLogo && (
                <img src={companyLogo} alt="Company Logo" className="w-16 h-16 object-contain mr-4 bg-white p-1 rounded" />
              )}
              <div>
                <h2 className="text-2xl font-bold mb-1">{yourCompany.name || "Your Company Name"}</h2>
                <p className="text-red-100">{yourCompany.address || "Company Address"}</p>
                <p className="text-red-100">{yourCompany.phone || "Company Phone"}</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-5xl font-black mb-2">INVOICE</h1>
              <div className="text-red-100 font-semibold space-y-1">
                <p>#{invoice.number || "N/A"}</p>
                <p>{invoice.date ? format(new Date(invoice.date), "MMM dd, yyyy") : "N/A"}</p>
                <p>Due: {invoice.paymentDate ? format(new Date(invoice.paymentDate), "MMM dd, yyyy") : "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4" >
          {/* Billing Information */}
          <div className="grid grid-cols-2 gap-8 mb-8" data-pdf-section="billing">
            <div className="border-l-4 border-red-600 bg-red-50 p-4">
              <h3 className="text-sm font-black text-red-800 mb-3 uppercase tracking-wide">Bill From</h3>
              <div className="text-gray-800">
                <p className="font-bold text-lg">{yourCompany.name || "Your Company Name"}</p>
                <p className="text-gray-600 mt-1">{yourCompany.address || "Company Address"}</p>
                <p className="text-gray-600">{yourCompany.phone || "Company Phone"}</p>
              </div>
            </div>
            <div className="border-l-4 border-gray-400 bg-gray-50 p-4">
              <h3 className="text-sm font-black text-gray-800 mb-3 uppercase tracking-wide">Bill To</h3>
              <div className="text-gray-800">
                <p className="font-bold text-lg">{billTo.name || "Client Name"}</p>
                <p className="text-gray-600 mt-1">{billTo.address || "Client Address"}</p>
                <p className="text-gray-600">{billTo.phone || "Client Phone"}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 border-2 border-red-600 rounded-lg overflow-hidden" data-pdf-section="items">
            <table className="w-full">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="text-left py-4 px-4 font-black uppercase text-sm">Description</th>
                  <th className="text-center py-4 px-4 font-black uppercase text-sm">HSN</th>
                  <th className="text-right py-4 px-4 font-black uppercase text-sm">Qty</th>
                  <th className="text-right py-4 px-4 font-black uppercase text-sm">Rate</th>
                  <th className="text-right py-4 px-4 font-black uppercase text-sm">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-red-25"}>
                    <td className="py-4 px-4 border-b border-red-100">
                      <p className="font-bold text-gray-900">{item.name || "Item Name"}</p>
                      {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                    </td>
                    <td className="py-4 px-4 text-center border-b border-red-100 text-gray-700">{item.hsnCode || '-'}</td>
                    <td className="py-4 px-4 text-right border-b border-red-100 text-gray-700">{item.quantity || 0}</td>
                    <td className="py-4 px-4 text-right border-b border-red-100 text-gray-700">{formatCurrency(item.amount || 0, selectedCurrency)}</td>
                    <td className="py-4 px-4 text-right border-b border-red-100 font-bold text-gray-900">{formatCurrency((item.quantity || 0) * (item.amount || 0), selectedCurrency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8" data-pdf-section="totals">
            <div className="w-80 border-2 border-red-600 rounded-lg">
              <div className="bg-red-600 text-white p-3">
                <h3 className="font-black uppercase text-sm">Invoice Summary</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-gray-700">Subtotal</span>
                  <span className="font-bold">{formatCurrency(subTotal, selectedCurrency)}</span>
                </div>
                {showDiscount && discountAmount > 0 && (
                  <div className="flex justify-between py-1 text-red-600">
                    <span className="font-semibold">Discount</span>
                    <span className="font-bold">-{formatCurrency(discountAmount, selectedCurrency)}</span>
                  </div>
                )}
                {gstType === "SGST_CGST" ? (
                  <>
                    <div className="flex justify-between py-1">
                      <span className="font-semibold text-gray-700">SGST ({gstRate / 2}%)</span>
                      <span className="font-bold">{formatCurrency(sgstAmount, selectedCurrency)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-semibold text-gray-700">CGST ({gstRate / 2}%)</span>
                      <span className="font-bold">{formatCurrency(cgstAmount, selectedCurrency)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-gray-700">IGST ({gstRate}%)</span>
                    <span className="font-bold">{formatCurrency(igstAmount, selectedCurrency)}</span>
                  </div>
                )}
                <div className="border-t-2 border-red-600 pt-3">
                  <div className="flex justify-between py-1">
                    <span className="text-xl font-black text-red-600">TOTAL</span>
                    <span className="text-2xl font-black text-red-600">{formatCurrency(grandTotal, selectedCurrency)}</span>
                  </div>
                </div>
                <div className="text-left text-sm text-gray-600 mt-4 capitalize">
                  <strong>Amount in words:</strong> {numberToWords(grandTotal)}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Content */}
          <div className="grid grid-cols-2 gap-8 mb-6" data-pdf-section="footer">
            {selectedBank && (
              <div className="border-2 border-gray-300 rounded-lg p-4">
                <h3 className="font-black text-gray-800 mb-3 uppercase text-sm">Payment Information</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p><span className="font-bold">Bank:</span> {selectedBank.bankName}</p>
                  <p><span className="font-bold">Account:</span> {selectedBank.accountNumber}</p>
                  <p><span className="font-bold">Name:</span> {selectedBank.accountHolderName}</p>
                  <p><span className="font-bold">IFSC:</span> {selectedBank.ifscCode}</p>
                  <p><span className="font-bold">Branch:</span> {selectedBank.branch}</p>
                </div>
              </div>
            )}
            {showQrCode && qrCode && (
              <div className="text-center border-2 border-red-600 rounded-lg p-4 bg-red-50">
                <h3 className="font-black text-red-800 mb-3 uppercase text-sm">Scan & Pay</h3>
                <img src={qrCode} alt="QR Code" className="w-24 h-24 object-contain mx-auto" />
              </div>
            )}
          </div>

          {showTermsAndConditions && termsAndConditions && (
            <div className="mb-6 border-2 border-gray-300 rounded-lg p-4" data-pdf-section="terms">
              <h3 className="font-black text-gray-800 mb-3 uppercase text-sm">Terms & Conditions</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{termsAndConditions}</p>
            </div>
          )}

          {notes && (
            <div className="mb-6" data-pdf-section="notes">
              <h3 className="font-black text-gray-800 mb-3 uppercase text-sm">Additional Notes</h3>
              <p className="text-sm text-gray-700">{notes}</p>
            </div>
          )}

          {/* Signature */}
          <div className="flex justify-end" data-pdf-section="signature">
            <div className="text-center">
              {signature && (
                <div className="mb-4">
                  <img src={signature} alt="Signature" className="max-w-32 max-h-16 object-contain mx-auto" />
                </div>
              )}
              <div className="border-t-4 border-red-600 w-40 mx-auto pt-3">
                <p className="font-black text-red-600 uppercase text-sm">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
};

export default Template13;
