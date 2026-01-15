
import React from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/formatCurrency';
import { numberToWords } from '../../utils/numberToWords';
import BaseTemplate from './BaseTemplate';

const Template11 = ({ data }) => {
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
        {/* Minimal Clean Header */}
        <div className="border-b-2 border-gray-200 pb-6 mb-8" data-pdf-section="header">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {companyLogo && (
                <img src={companyLogo} alt="Company Logo" className="w-16 h-16 object-contain mr-4" />
              )}
              <div>
                <h2 className="text-xl font-light text-gray-800 mb-1">
                  {yourCompany.name || "Your Company Name"}
                </h2>
                <p className="text-sm text-gray-600">{yourCompany.address || "Company Address"}</p>
                <p className="text-sm text-gray-600">{yourCompany.phone || "Company Phone"}</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-thin text-gray-700 mb-2">INVOICE</h1>
              <div className="text-sm text-gray-600 space-y-1">
                <p>#{invoice.number || "N/A"}</p>
                <p>{invoice.date ? format(new Date(invoice.date), "MMM dd, yyyy") : "N/A"}</p>
                <p>Due: {invoice.paymentDate ? format(new Date(invoice.paymentDate), "MMM dd, yyyy") : "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4">
          {/* Billing Information */}
          <div className="grid grid-cols-2 gap-8 mb-8" data-pdf-section="billing">
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">From</h3>
              <div className="text-gray-800">
                <p className="font-medium">{yourCompany.name || "Your Company Name"}</p>
                <p className="text-sm text-gray-600 mt-1">{yourCompany.address || "Company Address"}</p>
                <p className="text-sm text-gray-600">{yourCompany.phone || "Company Phone"}</p>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">To</h3>
              <div className="text-gray-800">
                <p className="font-medium">{billTo.name || "Client Name"}</p>
                <p className="text-sm text-gray-600 mt-1">{billTo.address || "Client Address"}</p>
                <p className="text-sm text-gray-600">{billTo.phone || "Client Phone"}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full" data-pdf-section="items">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Description</th>
                  <th className="text-center py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">HSN</th>
                  <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Qty</th>
                  <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Rate</th>
                  <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3">
                      <p className="font-medium text-gray-800">{item.name || "Item Name"}</p>
                      {item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>}
                    </td>
                    <td className="py-3 text-center text-sm text-gray-600">{item.hsnCode || '-'}</td>
                    <td className="py-3 text-right text-sm text-gray-600">{item.quantity || 0}</td>
                    <td className="py-3 text-right text-sm text-gray-600">{formatCurrency(item.amount || 0, selectedCurrency)}</td>
                    <td className="py-3 text-right font-medium text-gray-800">{formatCurrency((item.quantity || 0) * (item.amount || 0), selectedCurrency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8" data-pdf-section="totals">
            <div className="w-72">
              <div className="space-y-2 text-right">
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium">{formatCurrency(subTotal, selectedCurrency)}</span>
                </div>
                {showDiscount && discountAmount > 0 && (
                  <div className="flex justify-between py-1 text-red-600">
                    <span className="text-sm">Discount</span>
                    <span className="text-sm">-{formatCurrency(discountAmount, selectedCurrency)}</span>
                  </div>
                )}
                {gstType === "SGST_CGST" ? (
                  <>
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-600">SGST ({gstRate / 2}%)</span>
                      <span className="text-sm font-medium">{formatCurrency(sgstAmount, selectedCurrency)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-600">CGST ({gstRate / 2}%)</span>
                      <span className="text-sm font-medium">{formatCurrency(cgstAmount, selectedCurrency)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-gray-600">IGST ({gstRate}%)</span>
                    <span className="text-sm font-medium">{formatCurrency(igstAmount, selectedCurrency)}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between py-1">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-medium text-gray-800">{formatCurrency(grandTotal, selectedCurrency)}</span>
                  </div>
                </div>
                <div className="text-left text-xs text-gray-600 mt-3 capitalize">
                  <strong>In words:</strong> {numberToWords(grandTotal)}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Content */}
          <div className="grid grid-cols-2 gap-8 mb-6" data-pdf-section="footer">
            {selectedBank && (
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Payment Details</h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><span className="font-medium">Bank:</span> {selectedBank.bankName}</p>
                  <p><span className="font-medium">Account:</span> {selectedBank.accountNumber}</p>
                  <p><span className="font-medium">Name:</span> {selectedBank.accountHolderName}</p>
                  <p><span className="font-medium">IFSC:</span> {selectedBank.ifscCode}</p>
                  <p><span className="font-medium">Branch:</span> {selectedBank.branch}</p>
                </div>
              </div>
            )}
            {showQrCode && qrCode && (
              <div className="text-center">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Quick Payment</h3>
                <img src={qrCode} alt="QR Code" className="w-20 h-20 object-contain mx-auto" />
              </div>
            )}
          </div>

          {showTermsAndConditions && termsAndConditions && (
            <div className="mb-6" data-pdf-section="terms-conditions">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Terms & Conditions</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{termsAndConditions}</p>
            </div>
          )}

          {notes && (
            <div className="mb-6" data-pdf-section="notes">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Notes</h3>
              <p className="text-sm text-gray-600">{notes}</p>
            </div>
          )}

          {/* Signature */}
          <div className="flex justify-end" data-pdf-section="signature">
            <div className="text-center">
              {signature && (
                <div className="mb-3">
                  <img src={signature} alt="Signature" className="max-w-24 max-h-12 object-contain mx-auto" />
                </div>
              )}
              <div className="border-t border-gray-300 w-32 mx-auto pt-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
};

export default Template11;
