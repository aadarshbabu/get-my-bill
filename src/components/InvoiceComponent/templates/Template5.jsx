
import React from 'react';
import { format } from 'date-fns';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';
import { numberToWords } from '../../utils/numberToWords';

const Template5 = ({ data = {} }) => {
  const {
    billTo = {}, shipTo = {}, invoice = {}, yourCompany = {}, items = [],
    taxPercentage = 0, taxAmount = 0, subTotal = 0, grandTotal = 0, notes = '',
    selectedCurrency, companyLogo, signature, bankDetails, selectedBankAccount,
    qrCode, showQrCode, termsAndConditions, showTermsAndConditions, gstType,
    gstRate, sgstAmount, cgstAmount, igstAmount, discountType, discountValue,
    discountAmount, discountAppliedOn, showDiscount
  } = data;

  const selectedBank = bankDetails?.find(bank => bank.id.toString() === selectedBankAccount);

  return (
    <BaseTemplate data={data}>
      <div className="bg-white max-w-4xl mx-auto h-full">
        <div className="p-8">
          <div className="flex justify-between items-start" data-pdf-section="header">
            <div className="flex items-center">
              {companyLogo && (
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  className="w-16 h-16 object-contain mr-4"
                />
              )}
              <div>
                <h1 className="text-4xl font-bold text-green-600">Invoice</h1>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">
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

          <div className="flex justify-between mb-8 mt-4" data-pdf-section="billing">
            <div className="text-left w-1/2">
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Billed to
              </h3>
              <p className="font-bold">{billTo.name || "Client Name"}</p>
              <p>{billTo.address || "Client Address"}</p>
              <p>{billTo.phone || "Client Phone"}</p>
            </div>
            <div className="text-right w-1/3">
              <h3 className="text-lg font-semibold text-green-600 mb-2 text-left">
                Invoice Details
              </h3>
              <p className="flex justify-between">
                <span className="font-semibold">Invoice #:</span>
                <span>{invoice.number || "N/A"}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Invoice Date:</span>
                <span>
                  {invoice.date
                    ? format(new Date(invoice.date), "MMM dd, yyyy")
                    : "N/A"}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Due Date:</span>
                <span>
                  {invoice.paymentDate
                    ? format(new Date(invoice.paymentDate), "MMM dd, yyyy")
                    : "N/A"}
                </span>
              </p>
            </div>
          </div>

          <table className="w-full mb-8 border border-green-600" data-pdf-section="items">
            <thead className="bg-green-600 text-white">
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
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-green-50" : ""}
                >
                  <td className="p-2">{item.name || "Item Name"}</td>
                  <td className="p-2 text-center">{item.hsnCode || '-'}</td>
                  <td className="p-2 text-right">{item.quantity || 0}</td>
                  <td className="p-2 text-right">
                    {formatCurrency(item.amount || 0, selectedCurrency)}
                  </td>
                  <td className="p-2 text-right">
                    {formatCurrency((item.quantity || 0) * (item.amount || 0), selectedCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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

              <p className="flex justify-between font-bold text-lg mt-2">
                <span>Total Due:</span>{" "}
                <span className="text-green-600">
                  {formatCurrency(grandTotal, selectedCurrency)}
                </span>
              </p>
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
        </div>

        <div className="bg-green-50 p-4" data-pdf-section="footer">
          {/* Terms and Conditions */}
          {showTermsAndConditions && termsAndConditions && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-green-600 mb-2">Terms & Conditions:</h3>
              <p className="text-sm">{termsAndConditions}</p>
            </div>
          )}

          {notes && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Additional Notes
              </h3>
              <p>{notes}</p>
            </div>
          )}

          {/* Signature Section */}
          <div className="flex justify-end mb-4">
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

          {/* <div className="text-center text-sm text-gray-600">
            This is a computer-generated invoice and doesn't require a signature.
          </div> */}
        </div>
      </div>
    </BaseTemplate>
  );
};

export default Template5;
