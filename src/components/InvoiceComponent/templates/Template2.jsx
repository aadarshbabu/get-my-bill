import React from 'react';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';
import { numberToWords } from '../../utils/numberToWords';

const Template2 = ({ data }) => {
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
      <div className="bg-white p-8 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between mb-4 border-b-2 pb-4" data-pdf-section="header">
          <div className="flex items-center">
            {companyLogo && (
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                className="w-16 h-16 object-contain mr-4"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-cyan-700">
                {yourCompany.name}
              </h1>
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
            <h2 className="text-xl font-semibold text-cyan-700">Tax invoice</h2>
            <p>INVOICE NUMBER: {invoice.number}</p>
            <p>DATE: {invoice.date}</p>
            <p>DUE DATE: {invoice.paymentDate}</p>
          </div>
        </div>

        {/* Billing Section */}
        <div className="flex justify-between mb-8" data-pdf-section="billing">
          <div>
            <h3 className="font-semibold text-lg mb-2 text-cyan-700">Bill To</h3>
            <p>{billTo.name}</p>
            <p>{billTo.address}</p>
            <p>{billTo.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-cyan-700">Ship To</h3>
            <p>{shipTo.name}</p>
            <p>{shipTo.address}</p>
            <p>{shipTo.phone}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8" data-pdf-section="items">
          <table className="w-full border border-gray-300">
            <thead>
              <tr>
                <th className="p-2 text-left border border-gray-300">ID</th>
                <th className="p-2 text-left border border-gray-300">Description</th>
                <th className="p-2 text-center border border-gray-300">HSN Code</th>
                <th className="p-2 text-right border border-gray-300">Quantity</th>
                <th className="p-2 text-right border border-gray-300">Rate</th>
                <th className="p-2 text-right border border-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border border-gray-300">{index + 1}</td>
                  <td className="p-2 border border-gray-300">
                    {item.name}
                    <div className="text-sm text-gray-500">
                      {item.description}
                    </div>
                  </td>
                  <td className="p-2 text-center border border-gray-300">{item.hsnCode || '-'}</td>
                  <td className="p-2 text-right border border-gray-300">
                    {item.quantity}
                  </td>
                  <td className="p-2 text-right border border-gray-300">
                    {formatCurrency(item.amount, selectedCurrency)}
                  </td>
                  <td className="p-2 text-right border border-gray-300">
                    {formatCurrency(item.total, selectedCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end" data-pdf-section="totals">
          <div className="w-1/3">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{formatCurrency(subTotal, selectedCurrency)}</span>
            </div>
            
            {showDiscount && discountAmount > 0 && (
              <div className="flex justify-between mb-2 text-red-600">
                <span>Discount:</span>
                <span>-{formatCurrency(discountAmount, selectedCurrency)}</span>
              </div>
            )}
            
            {gstType === "SGST_CGST" ? (
              <>
                <div className="flex justify-between mb-2">
                  <span>SGST ({gstRate/2}%):</span>
                  <span>{formatCurrency(sgstAmount, selectedCurrency)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>CGST ({gstRate/2}%):</span>
                  <span>{formatCurrency(cgstAmount, selectedCurrency)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between mb-2">
                <span>IGST ({gstRate}%):</span>
                <span>{formatCurrency(igstAmount, selectedCurrency)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{formatCurrency(grandTotal, selectedCurrency)}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600 capitalize">
              <strong>Amount in words:</strong> {numberToWords(grandTotal)}
            </div>
          </div>
        </div>

        {/* Bank Details and QR Code Section */}
        <div className="flex justify-between mt-8 mb-8" data-pdf-section="bank-details">
          <div className="flex-1 mr-8">
            {selectedBank && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3 text-cyan-700">Bank Details:</h3>
                <div className="text-sm space-y-2 bg-cyan-50 p-4 rounded border border-cyan-200">
                  <p><strong>Bank Name:</strong> {selectedBank.bankName}</p>
                  <p><strong>Account Number:</strong> {selectedBank.accountNumber}</p>
                  <p><strong>Account Holder:</strong> {selectedBank.accountHolderName}</p>
                  <p><strong>IFSC Code:</strong> {selectedBank.ifscCode}</p>
                  <p className="pb-2"><strong>Branch:</strong> {selectedBank.branch}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            {showQrCode && qrCode && (
              <div className="pt-6">
                <h4 className="font-semibold mb-2 text-cyan-700">QR Code:</h4>
                <img src={qrCode} alt="QR Code" className="w-24 h-24 object-contain border border-gray-200" />
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        {showTermsAndConditions && termsAndConditions && (
          <div className="mt-8 mb-8 border-t pt-6" data-pdf-section="terms">
            <h3 className="font-semibold mb-3 text-cyan-700">Terms & Conditions:</h3>
            <p className="text-sm bg-cyan-50 p-4 rounded border border-cyan-200">{termsAndConditions}</p>
          </div>
        )}

        {notes && (
          <div className="mt-8 mb-8 text-sm" data-pdf-section="notes">
            <h3 className="font-semibold mb-3 text-cyan-700">Notes:</h3>
            <p className="bg-gray-50 p-4 rounded border border-gray-200">{notes}</p>
          </div>
        )}

        {/* Signature Section */}
        <div className="flex justify-end mt-8 mb-8" data-pdf-section="signature">
          <div className="text-right">
            {signature && (
              <div className="mb-4">
                <img src={signature} alt="Signature" className="max-w-32 max-h-16 object-contain ml-auto" />
              </div>
            )}
            <div className="border-t border-cyan-400 pt-3">
              <h4 className="font-semibold text-cyan-700">Authorized Signature</h4>
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
};

export default Template2;
