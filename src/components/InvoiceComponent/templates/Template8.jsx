
import React from 'react';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';
import { numberToWords } from '../../utils/numberToWords';

const Template8 = ({ data }) => {
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
      <div
        className="bg-gray-100 w-full min-h-full flex flex-col"
        style={{ margin: "0", padding: "16px" }}
      >
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
            <h1 className="text-4xl font-bold" style={{ color: "#3C8BF6" }}>
              Invoice
            </h1>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">{yourCompany.name}</h2>
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

        <div className="grid grid-cols-2 gap-8 mb-8" data-pdf-section="billing">
          <div>
            <h3 className="text-lg font-semibold mb-2">Billed to</h3>
            <p className="font-bold">{billTo.name}</p>
            <p>{billTo.address}</p>
            <p>{billTo.phone}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Invoice Details</h3>
            <p>
              <span className="font-semibold">Invoice #:</span> {invoice.number}
            </p>
            <p>
              <span className="font-semibold">Invoice Date:</span>{" "}
              {invoice.date}
            </p>
            <p>
              <span className="font-semibold">Due Date:</span>{" "}
              {invoice.paymentDate}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto mb-8" data-pdf-section="items">
          <table className="w-full min-w-[600px]">
            <thead style={{ backgroundColor: "#3C8BF6", color: "white" }}>
              <tr>
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-center">HSN Code</th>
                <th className="p-2 text-right">Quantity</th>
                <th className="p-2 text-right">Rate</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-2">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.description || ""}</p>
                  </td>
                  <td className="p-2 text-center">{item.hsnCode || '-'}</td>
                  <td className="p-2 text-right">{item.quantity}</td>
                  <td className="p-2 text-right">
                    {formatCurrency(item.amount, selectedCurrency)}
                  </td>
                  <td className="p-2 text-right">
                    {formatCurrency(item.quantity * item.amount, selectedCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8" data-pdf-section="totals">
          <div className="w-1/2">
            <div className="flex justify-between mb-2">
              <span>Sub Total:</span>
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
                  <span>SGST ({gstRate / 2}%):</span>
                  <span>{formatCurrency(sgstAmount, selectedCurrency)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>CGST ({gstRate / 2}%):</span>
                  <span>{formatCurrency(cgstAmount, selectedCurrency)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between mb-2">
                <span>IGST ({gstRate}%):</span>
                <span>{formatCurrency(igstAmount, selectedCurrency)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total Due:</span>
              <span style={{ color: "#3C8BF6" }}>
                {formatCurrency(grandTotal, selectedCurrency)}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600 capitalize">
              <strong>Amount in words:</strong> {numberToWords(grandTotal)}
            </div>
          </div>
        </div>

        {/* Bank Details and QR Code Section */}
        <div className="flex justify-between mb-6" data-pdf-section="bank-details">
          <div className="flex-1">
            {selectedBank && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Bank Details:</h3>
                <div className="text-sm">
                  <p><strong>Bank Name:</strong> {selectedBank.bankName}</p>
                  <p><strong>Account Number:</strong> {selectedBank.accountNumber}</p>
                  <p><strong>Account Holder:</strong> {selectedBank.accountHolderName}</p>
                  <p><strong>IFSC Code:</strong> {selectedBank.ifscCode}</p>
                  <p><strong>Branch:</strong> {selectedBank.branch}</p>
                </div>
              </div>
            )}
          </div>
          <div className="ml-8">
            {showQrCode && qrCode && (
              <div>
                <h4 className="font-semibold mb-2">QR Code:</h4>
                <img src={qrCode} alt="QR Code" className="w-24 h-24 object-contain" />
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        {showTermsAndConditions && termsAndConditions && (
          <div className="mb-6 border-t pt-4" data-pdf-section="terms">
            <h3 className="text-lg font-semibold mb-2">Terms & Conditions:</h3>
            <p className="text-sm">{termsAndConditions}</p>
          </div>
        )}

        {notes && (
          <div className="mt-8 border-t pt-4" data-pdf-section="notes">
            <h3 className="text-lg font-semibold mb-2">Notes:</h3>
            <p>{notes}</p>
          </div>
        )}

        {/* Signature Section */}
        <div className="flex justify-end mt-6" data-pdf-section="signature">
          <div className="text-right">
            {signature && (
              <div className="mb-2">
                <img src={signature} alt="Signature" className="max-w-32 max-h-16 object-contain ml-auto" />
              </div>
            )}
            <h4 className="font-semibold">Authorized Signature:</h4>
            {!signature && (
              <div className="w-32 h-16 border-b border-gray-400 mt-2"></div>
            )}
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
};

export default Template8;
