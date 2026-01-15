
import React from 'react';
import { format } from 'date-fns';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';
import { numberToWords } from '../../utils/numberToWords';

const Template6 = ({ data }) => {
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
              <h2 className="text-2xl font-bold" style={{ color: "#14A8DE" }}>
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
          <div className="text-right">
            <h1 className="text-3xl font-thin mb-4">Tax Invoice</h1>
            <p>
              <span className="font-semibold">Invoice No:</span>{" "}
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
          <div>
            <h3 className="text-lg font-semibold mb-2">Billed to</h3>
            <p>{billTo.name || "Client Name"}</p>
            <p>{billTo.address || "Client Address"}</p>
            <p>{billTo.phone || "Client Phone"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Ship to</h3>
            <p>{shipTo.name || "Client Name"}</p>
            <p>{shipTo.address || "Client Address"}</p>
            <p>{shipTo.phone || "Client Phone"}</p>
          </div>
        </div>

        <table className="w-full mb-8 border border-gray-300" data-pdf-section="items">
          <thead style={{ backgroundColor: "#14A8DE" }}>
            <tr>
              <th className="p-2 text-left border-b border-gray-300 text-white">
                Item #/Item description
              </th>
              <th className="p-2 text-center border-b border-gray-300 text-white">
                HSN Code
              </th>
              <th className="p-2 text-right border-b border-gray-300 text-white">
                Quantity
              </th>
              <th className="p-2 text-right border-b border-gray-300 text-white">
                Rate
              </th>
              <th className="p-2 text-right border-b border-gray-300 text-white">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="p-2 border border-gray-300">
                  <p className="font-semibold">{item.name || "Item Name"}</p>
                  <p className="text-sm text-gray-600">
                    {item.description || "Item Description"}
                  </p>
                </td>
                <td className="p-2 text-center border border-gray-300">
                  {item.hsnCode || '-'}
                </td>
                <td className="p-2 text-right border border-gray-300">
                  {item.quantity || 0}
                </td>
                <td className="p-2 text-right border border-gray-300">
                  {formatCurrency(item.amount || 0, selectedCurrency)}
                </td>
                <td className="p-2 text-right border border-gray-300">
                  {formatCurrency((item.amount || 0) * (item.quantity || 0), selectedCurrency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end" data-pdf-section="totals">
          <table className="w-1/2 mb-8 border border-gray-300">
            <tbody>
              <tr>
                <td className="p-2 text-right font-semibold border border-gray-300">
                  Sub Total
                </td>
                <td className="p-2 text-right border border-gray-300">
                  {formatCurrency(subTotal, selectedCurrency)}
                </td>
              </tr>
              {showDiscount && discountAmount > 0 && (
                <tr>
                  <td className="p-2 text-right font-semibold border border-gray-300 text-red-600">
                    Discount
                  </td>
                  <td className="p-2 text-right border border-gray-300 text-red-600">
                    -{formatCurrency(discountAmount, selectedCurrency)}
                  </td>
                </tr>
              )}
              {gstType === "SGST_CGST" ? (
                <>
                  <tr>
                    <td className="p-2 text-right font-semibold border border-gray-300">
                      SGST ({gstRate / 2}%)
                    </td>
                    <td className="p-2 text-right border border-gray-300">
                      {formatCurrency(sgstAmount, selectedCurrency)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 text-right font-semibold border border-gray-300">
                      CGST ({gstRate / 2}%)
                    </td>
                    <td className="p-2 text-right border border-gray-300">
                      {formatCurrency(cgstAmount, selectedCurrency)}
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td className="p-2 text-right font-semibold border border-gray-300">
                    IGST ({gstRate}%)
                  </td>
                  <td className="p-2 text-right border border-gray-300">
                    {formatCurrency(igstAmount, selectedCurrency)}
                  </td>
                </tr>
              )}
              <tr className="text-white" style={{ backgroundColor: "#14A8DE" }}>
                <td className="p-2 text-right font-semibold border border-gray-300">
                  Total Due Amount
                </td>
                <td className="p-2 text-right border border-gray-300">
                  {formatCurrency(grandTotal, selectedCurrency)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4 text-sm text-gray-600 capitalize" data-pdf-section="totals">
          <strong>Amount in words:</strong> {numberToWords(grandTotal)}
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
          <div className="mb-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Terms & Conditions:</h3>
            <p className="text-sm">{termsAndConditions}</p>
          </div>
        )}

        <div className="text-center text-sm border-t pt-4">
          <p>{notes}</p>
        </div>

        {/* Signature Section */}
        <div className="flex justify-end mt-6">
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

export default Template6;
