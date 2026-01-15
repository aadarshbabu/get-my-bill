import React from 'react';
import { format } from 'date-fns';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';
import { numberToWords } from '../../utils/numberToWords';

const Template4 = ({ data }) => {
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
              <h1 className="text-4xl font-bold text-purple-600 mb-4">Invoice</h1>
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
          <div className="text-right">
            <h2 className="text-2xl font-bold">
              {yourCompany.name || "Company Name"}
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

        <div className="grid grid-cols-2 gap-8 mb-8" data-pdf-section="billing">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">
              Billed by
            </h3>
            <p>
              <strong>{yourCompany.name || "Company Name"}</strong>
            </p>
            <p>{yourCompany.address || "Company Address"}</p>
            <p>{yourCompany.phone || "Company Phone"}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">
              Billed to
            </h3>
            <p>
              <strong>{billTo.name || "Client Name"}</strong>
            </p>
            <p>{billTo.address || "Client Address"}</p>
            <p>{billTo.phone || "Client Phone"}</p>
          </div>
        </div>

        <div data-pdf-section="items">
          <table className="w-full mb-8 border border-gray-300">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-2 text-left border border-gray-300">Item #/Item Description</th>
                <th className="p-2 text-center border border-gray-300">HSN Code</th>
                <th className="p-2 text-right border border-gray-300">Qty.</th>
                <th className="p-2 text-right border border-gray-300">Rate</th>
                <th className="p-2 text-right border border-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="bg-gray-100">
                  <td className="p-2 border border-gray-300 truncate">
                    {`${index + 1}. ${item.name || "Item Name"}`}
                    <br />
                    <span className="text-sm text-gray-600">
                      {item.description || "Item Description"}
                    </span>
                  </td>
                  <td className="p-2 text-center border border-gray-300">{item.hsnCode || '-'}</td>
                  <td className="p-2 text-right border border-gray-300">
                    {item.quantity || 0}
                  </td>
                  <td className="p-2 text-right border border-gray-300">
                    {formatCurrency(item.amount || 0, selectedCurrency)}
                  </td>
                  <td className="p-2 text-right border border-gray-300">
                    {formatCurrency((item.quantity || 0) * (item.amount || 0), selectedCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8" data-pdf-section="totals">
          <div className="w-1/3">
            <p className="flex justify-between">
              <span>Sub Total:</span> <span>{formatCurrency(subTotal, selectedCurrency)}</span>
            </p>

            {showDiscount && discountAmount > 0 && (
              <p className="flex justify-between text-red-600">
                <span>Discount:</span> <span>-{formatCurrency(discountAmount, selectedCurrency)}</span>
              </p>
            )}

            {gstType === "SGST_CGST" ? (
              <>
                <p className="flex justify-between">
                  <span>SGST ({gstRate / 2}%):</span> <span>{formatCurrency(sgstAmount, selectedCurrency)}</span>
                </p>
                <p className="flex justify-between">
                  <span>CGST ({gstRate / 2}%):</span> <span>{formatCurrency(cgstAmount, selectedCurrency)}</span>
                </p>
              </>
            ) : (
              <p className="flex justify-between">
                <span>IGST ({gstRate}%):</span> <span>{formatCurrency(igstAmount, selectedCurrency)}</span>
              </p>
            )}

            <hr className="my-2" />
            <p className="flex justify-between font-bold text-lg mt-2">
              <span>Total:</span> <span>{formatCurrency(grandTotal, selectedCurrency)}</span>
            </p>
            <div className="mt-2 text-sm text-gray-600 capitalize">
              <strong>Amount in words:</strong> {numberToWords(grandTotal)}
            </div>
          </div>
        </div>

        {/* Bank Details and QR Code Section */}
        <div className="flex justify-between mt-8" data-pdf-section="bank-details">
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
          <div className="mt-8 border-t pt-4" data-pdf-section="terms">
            <h3 className="font-semibold mb-2">Terms & Conditions:</h3>
            <p className="text-sm">{termsAndConditions}</p>
          </div>
        )}

        {notes && (
          <div className="mb-8" data-pdf-section="notes">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Note</h3>
            <p>{notes}</p>
          </div>
        )}

        {/* Signature Section */}
        <div className="flex justify-end mt-8" data-pdf-section="signature">
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

export default Template4;
