
import React from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/formatCurrency';
import { numberToWords } from '../../utils/numberToWords';
import BaseTemplate from './BaseTemplate';

const Template14 = ({ data }) => {
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
      <div className="bg-white min-h-screen p-4">
        {/* Ocean Cyan Header */}
        <div
          className="text-white p-4 mb-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)' }}
          data-pdf-section="header"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center">
              {companyLogo && (
                <img src={companyLogo} alt="Company Logo" className="w-16 h-16 object-contain mr-4 bg-white p-2 rounded-lg shadow-lg" />
              )}
              <div>
                <h2 className="text-2xl font-bold mb-1">{yourCompany.name || "Your Company Name"}</h2>
                <p className="text-cyan-100">{yourCompany.address || "Company Address"}</p>
                <p className="text-cyan-100">{yourCompany.phone || "Company Phone"}</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-5xl font-bold mb-2 tracking-wide">INVOICE</h1>
              <div className="text-cyan-100 space-y-1">
                <p className="font-semibold">#{invoice.number || "N/A"}</p>
                <p>{invoice.date ? format(new Date(invoice.date), "MMM dd, yyyy") : "N/A"}</p>
                <p>Due: {invoice.paymentDate ? format(new Date(invoice.paymentDate), "MMM dd, yyyy") : "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4" >
          {/* Billing Information */}
          <div className="grid grid-cols-2 gap-8 mb-8" data-pdf-section="billing">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 rounded-xl border border-cyan-200">
              <h3 className="text-sm font-bold text-cyan-700 mb-3 uppercase tracking-wide">Invoice From</h3>
              <div className="text-gray-800">
                <p className="font-bold text-lg">{yourCompany.name || "Your Company Name"}</p>
                <p className="text-gray-600 mt-1">{yourCompany.address || "Company Address"}</p>
                <p className="text-gray-600">{yourCompany.phone || "Company Phone"}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Invoice To</h3>
              <div className="text-gray-800">
                <p className="font-bold text-lg">{billTo.name || "Client Name"}</p>
                <p className="text-gray-600 mt-1">{billTo.address || "Client Address"}</p>
                <p className="text-gray-600">{billTo.phone || "Client Phone"}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg border border-cyan-200" data-pdf-section="items">
            <table className="w-full">
              <thead
                className="text-white"
                style={{ background: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)' }}
              >
                <tr>
                  <th className="text-left py-4 px-4 font-bold uppercase text-sm">Item Description</th>
                  <th className="text-center py-4 px-4 font-bold uppercase text-sm">HSN</th>
                  <th className="text-right py-4 px-4 font-bold uppercase text-sm">Qty</th>
                  <th className="text-right py-4 px-4 font-bold uppercase text-sm">Rate</th>
                  <th className="text-right py-4 px-4 font-bold uppercase text-sm">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-cyan-25"}>
                    <td className="py-4 px-4 border-b border-cyan-100">
                      <p className="font-semibold text-gray-900">{item.name || "Item Name"}</p>
                      {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                    </td>
                    <td className="py-4 px-4 text-center border-b border-cyan-100 text-gray-700">{item.hsnCode || '-'}</td>
                    <td className="py-4 px-4 text-right border-b border-cyan-100 text-gray-700">{item.quantity || 0}</td>
                    <td className="py-4 px-4 text-right border-b border-cyan-100 text-gray-700">{formatCurrency(item.amount || 0, selectedCurrency)}</td>
                    <td className="py-4 px-4 text-right border-b border-cyan-100 font-semibold text-gray-900">{formatCurrency((item.quantity || 0) * (item.amount || 0), selectedCurrency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8" data-pdf-section="totals">
            <div className="w-80 rounded-xl overflow-hidden shadow-lg border border-cyan-200">
              <div
                className="text-white p-4"
                style={{ background: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)' }}
              >
                <h3 className="font-bold uppercase text-sm">Total Summary</h3>
              </div>
              <div className="bg-gradient-to-b from-cyan-50 to-white p-4 space-y-3">
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subTotal, selectedCurrency)}</span>
                </div>
                {showDiscount && discountAmount > 0 && (
                  <div className="flex justify-between py-1 text-red-600">
                    <span className="font-semibold">Discount</span>
                    <span className="font-semibold">-{formatCurrency(discountAmount, selectedCurrency)}</span>
                  </div>
                )}
                {gstType === "SGST_CGST" ? (
                  <>
                    <div className="flex justify-between py-1">
                      <span className="font-semibold text-gray-600">SGST ({gstRate / 2}%)</span>
                      <span className="font-semibold">{formatCurrency(sgstAmount, selectedCurrency)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-semibold text-gray-600">CGST ({gstRate / 2}%)</span>
                      <span className="font-semibold">{formatCurrency(cgstAmount, selectedCurrency)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-gray-600">IGST ({gstRate}%)</span>
                    <span className="font-semibold">{formatCurrency(igstAmount, selectedCurrency)}</span>
                  </div>
                )}
                <div className="border-t-2 border-cyan-300 pt-3">
                  <div className="flex justify-between py-1">
                    <span className="text-xl font-bold text-cyan-700">TOTAL</span>
                    <span className="text-2xl font-bold text-cyan-700">{formatCurrency(grandTotal, selectedCurrency)}</span>
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
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border border-cyan-200">
                <h3 className="font-bold text-cyan-700 mb-3 uppercase text-sm">Banking Details</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><span className="font-semibold">Bank:</span> {selectedBank.bankName}</p>
                  <p><span className="font-semibold">Account:</span> {selectedBank.accountNumber}</p>
                  <p><span className="font-semibold">Name:</span> {selectedBank.accountHolderName}</p>
                  <p><span className="font-semibold">IFSC:</span> {selectedBank.ifscCode}</p>
                  <p><span className="font-semibold">Branch:</span> {selectedBank.branch}</p>
                </div>
              </div>
            )}
            {showQrCode && qrCode && (
              <div className="text-center bg-gradient-to-b from-cyan-50 to-blue-50 p-5 rounded-xl border border-cyan-200">
                <h3 className="font-bold text-cyan-700 mb-3 uppercase text-sm">Quick Payment</h3>
                <img src={qrCode} alt="QR Code" className="w-24 h-24 object-contain mx-auto rounded-lg" />
              </div>
            )}
          </div>

          {showTermsAndConditions && termsAndConditions && (
            <div className="mb-6 bg-gray-50 p-5 rounded-xl border border-gray-200" data-pdf-section="terms">
              <h3 className="font-bold text-gray-700 mb-3 uppercase text-sm">Terms & Conditions</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{termsAndConditions}</p>
            </div>
          )}

          {notes && (
            <div className="mb-6" data-pdf-section="notes">
              <h3 className="font-bold text-gray-700 mb-3 uppercase text-sm">Notes</h3>
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
              <div className="border-t-3 border-cyan-600 w-40 mx-auto pt-3">
                <p className="font-bold text-cyan-700 uppercase text-sm">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
};

export default Template14;
