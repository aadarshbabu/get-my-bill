
import React from 'react';
import { format } from 'date-fns';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';
import { numberToWords } from '../../utils/numberToWords';

const Template9 = ({ data }) => {
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
      <div className="bg-white p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8" data-pdf-section="header">
          <div className="flex items-center">
            {companyLogo && (
              <img
                src={companyLogo}
                alt="Company Logo"
                className="w-16 h-16 object-contain mr-4"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-orange-600 mb-2">Invoice</h1>
              <h2 className="text-xl font-bold">
                {yourCompany.name || "Your Company Name"}
              </h2>
              <p>{yourCompany.address || "Company Address"}</p>
              <p>{yourCompany.phone || "Company Phone"}</p>
              {(yourCompany.gstin || yourCompany.pan) && (
                <div className="text-sm text-gray-600 mt-1">
                  {yourCompany.gstin && <p>GSTIN: {yourCompany.gstin}</p>}
                  {yourCompany.pan && <p>PAN: {yourCompany.pan}</p>}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <p>
              <span className="font-semibold">Invoice#:</span>{" "}
              {invoice.number || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Invoice Date:</span>{" "}
              {invoice.date
                ? format(new Date(invoice.date), "MMM dd, yyyy")
                : "N/A"}
            </p>
            <p>
              <span className="font-semibold">Due Date:</span>{" "}
              {invoice.paymentDate
                ? format(new Date(invoice.paymentDate), "MMM dd, yyyy")
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8" data-pdf-section="billing">
          <div className="bg-orange-50 p-4 rounded">
            <h3 className="text-lg font-semibold text-orange-600 mb-2">
              Billed by
            </h3>
            <p>{yourCompany.name || "Your Company Name"}</p>
            <p>{yourCompany.address || "Your Company Address"}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded">
            <h3 className="text-lg font-semibold text-orange-600 mb-2">
              Billed to
            </h3>
            <p>{billTo.name || "Client Name"}</p>
            <p>{billTo.address || "Client Address"}</p>
          </div>
        </div>

        <div className="w-full mb-8 overflow-hidden rounded-lg border border-orange-50" data-pdf-section="items">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-600 text-white">
                <tr>
                  <th className="p-2 text-left">Item #/Item description</th>
                  <th className="p-2 text-center">HSN Code</th>
                  <th className="p-2 text-right">Qty.</th>
                  <th className="p-2 text-right">Rate</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="bg-orange-50">
                    <td className="p-2">
                      <p className="font-semibold">{item.name || "Item Name"}</p>
                      <p className="text-sm text-gray-600">{item.description || ""}</p>
                    </td>
                    <td className="p-2 text-center">{item.hsnCode || '-'}</td>
                    <td className="p-2 text-right">{item.quantity || 0}</td>
                    <td className="p-2 text-right">
                      {formatCurrency(item.amount || 0, selectedCurrency)}
                    </td>
                    <td className="p-2 text-right">
                      {formatCurrency(
                        (item.quantity || 0) * (item.amount || 0),
                        selectedCurrency
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end mb-8" data-pdf-section="totals">
          <div className="w-1/2 bg-orange-50 p-3 rounded-lg">
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
            <div className="flex justify-between font-bold text-lg mt-2 text-orange-600">
              <span>Total:</span>
              <span className="text-orange-600">
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
            <h3 className="text-lg font-semibold text-orange-600 mb-2">
              Terms & Conditions
            </h3>
            <p className="text-sm">{termsAndConditions}</p>
          </div>
        )}

        {notes && (
          <div className="mb-8" data-pdf-section="notes">
            <h3 className="text-lg font-semibold text-orange-600 mb-2">
              Remarks
            </h3>
            <p>{notes}</p>
          </div>
        )}

        {/* Signature Section */}
        <div className="flex justify-end" data-pdf-section="signature">
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

export default Template9;
