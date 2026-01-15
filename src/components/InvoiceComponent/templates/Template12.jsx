
import React from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/formatCurrency';
import { numberToWords } from '../../utils/numberToWords';
import BaseTemplate from './BaseTemplate';

const Template12 = ({ data }) => {
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
        {/* Purple Elite Header */}
        <div
          className="text-white p-4 mb-8"
          style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
          data-pdf-section="header"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {companyLogo && (
                <img src={companyLogo} alt="Company Logo" className="w-16 h-16 object-contain mr-4 bg-white p-1 rounded" />
              )}
              <div>
                <h2 className="text-xl font-bold mb-1">{yourCompany.name || "Your Company Name"}</h2>
                <p className="text-purple-100 text-sm">{yourCompany.address || "Company Address"}</p>
                <p className="text-purple-100 text-sm">{yourCompany.phone || "Company Phone"}</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-bold mb-2">INVOICE</h1>
              <div className="text-purple-100 space-y-1">
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
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="text-sm font-bold text-purple-700 mb-3">INVOICE FROM</h3>
              <div className="text-gray-800">
                <p className="font-semibold">{yourCompany.name || "Your Company Name"}</p>
                <p className="text-sm text-gray-600 mt-1">{yourCompany.address || "Company Address"}</p>
                <p className="text-sm text-gray-600">{yourCompany.phone || "Company Phone"}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-3">INVOICE TO</h3>
              <div className="text-gray-800">
                <p className="font-semibold">{billTo.name || "Client Name"}</p>
                <p className="text-sm text-gray-600 mt-1">{billTo.address || "Client Address"}</p>
                <p className="text-sm text-gray-600">{billTo.phone || "Client Phone"}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 border border-purple-200 rounded-lg overflow-hidden" data-pdf-section="items">
            <table className="w-full">
              <thead className="bg-purple-100">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-bold text-purple-700">DESCRIPTION</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-purple-700">HSN</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-purple-700">QTY</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-purple-700">RATE</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-purple-700">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-purple-25"}>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-800">{item.name || "Item Name"}</p>
                      {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-600">{item.hsnCode || '-'}</td>
                    <td className="py-3 px-4 text-right text-sm text-gray-600">{item.quantity || 0}</td>
                    <td className="py-3 px-4 text-right text-sm text-gray-600">{formatCurrency(item.amount || 0, selectedCurrency)}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-800">{formatCurrency((item.quantity || 0) * (item.amount || 0), selectedCurrency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8" data-pdf-section="totals">
            <div className="w-80 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between py-1">
                  <span className="text-sm font-medium text-gray-600">Subtotal</span>
                  <span className="text-sm font-semibold">{formatCurrency(subTotal, selectedCurrency)}</span>
                </div>
                {showDiscount && discountAmount > 0 && (
                  <div className="flex justify-between py-1 text-red-600">
                    <span className="text-sm font-medium">Discount</span>
                    <span className="text-sm font-semibold">-{formatCurrency(discountAmount, selectedCurrency)}</span>
                  </div>
                )}
                {gstType === "SGST_CGST" ? (
                  <>
                    <div className="flex justify-between py-1">
                      <span className="text-sm font-medium text-gray-600">SGST ({gstRate / 2}%)</span>
                      <span className="text-sm font-semibold">{formatCurrency(sgstAmount, selectedCurrency)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm font-medium text-gray-600">CGST ({gstRate / 2}%)</span>
                      <span className="text-sm font-semibold">{formatCurrency(cgstAmount, selectedCurrency)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1">
                    <span className="text-sm font-medium text-gray-600">IGST ({gstRate}%)</span>
                    <span className="text-sm font-semibold">{formatCurrency(igstAmount, selectedCurrency)}</span>
                  </div>
                )}
                <div className="border-t-2 border-purple-300 pt-3">
                  <div className="flex justify-between py-1">
                    <span className="text-lg font-bold text-purple-700">TOTAL</span>
                    <span className="text-xl font-bold text-purple-700">{formatCurrency(grandTotal, selectedCurrency)}</span>
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
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 mb-3">PAYMENT DETAILS</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-semibold">Bank:</span> {selectedBank.bankName}</p>
                  <p><span className="font-semibold">Account:</span> {selectedBank.accountNumber}</p>
                  <p><span className="font-semibold">Name:</span> {selectedBank.accountHolderName}</p>
                  <p><span className="font-semibold">IFSC:</span> {selectedBank.ifscCode}</p>
                  <p><span className="font-semibold">Branch:</span> {selectedBank.branch}</p>
                </div>
              </div>
            )}
            {showQrCode && qrCode && (
              <div className="text-center bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="text-sm font-bold text-purple-700 mb-3">SCAN TO PAY</h3>
                <img src={qrCode} alt="QR Code" className="w-24 h-24 object-contain mx-auto" />
              </div>
            )}
          </div>

          {showTermsAndConditions && termsAndConditions && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200" data-pdf-section="terms-conditions">
              <h3 className="text-sm font-bold text-gray-700 mb-3">TERMS & CONDITIONS</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{termsAndConditions}</p>
            </div>
          )}

          {notes && (
            <div className="mb-6" data-pdf-section="notes">
              <h3 className="text-sm font-bold text-gray-700 mb-3">NOTES</h3>
              <p className="text-sm text-gray-600">{notes}</p>
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
              <div className="border-t-2 border-purple-600 w-40 mx-auto pt-2">
                <p className="text-sm font-bold text-purple-700">AUTHORIZED SIGNATURE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
};

export default Template12;
