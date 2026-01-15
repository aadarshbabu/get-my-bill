import React from 'react';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';
import { numberToWords } from '../../utils/numberToWords';

const Template3 = ({ data }) => {
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
      <div className="bg-blue-500 text-white p-12" data-pdf-section="header">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center">
            {companyLogo && (
              <img
                src={companyLogo}
                alt="Company Logo"
                className="w-16 h-16 object-contain mr-4 bg-white p-1 rounded"
              />
            )}
            <div>
              <div className="text-white inline-block">
                <h1 className="text-2xl font-bold" id="company-name">
                  {yourCompany?.name || "Your Company Name"}
                </h1>
              </div>
              <p className="mt-2">
                {yourCompany?.address || "Your Company Address"}
              </p>
              <p>{yourCompany?.phone || "Your Company Phone"}</p>
              {(yourCompany.gstin || yourCompany.pan) && (
                <div className="text-sm mt-1">
                  {yourCompany.gstin && <p>GSTIN: {yourCompany.gstin}</p>}
                  {yourCompany.pan && <p>PAN: {yourCompany.pan}</p>}
                </div>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">BILLED TO</h2>
            <p>{billTo.name}</p>
            <p>{billTo.address}</p>
            <p>{billTo.phone}</p>
          </div>
        </div>
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">SHIP TO</h2>
            <p>{shipTo.name}</p>
            <p>{shipTo.address}</p>
            <p>{shipTo.phone}</p>
          </div>
          <div className="text-right">
            <p>Invoice #: {invoice.number}</p>
            <p>Invoice Date: {invoice.date}</p>
            <p>Due Date: {invoice.paymentDate}</p>
            <p>Due Amount: {formatCurrency(grandTotal, selectedCurrency)}</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-blue-500 -mt-[42px] w-[92%] mx-auto">
        <div id="item-data" className="w-full mb-8" data-pdf-section="items">
          <div className="bg-blue-200 flex rounded-t">
            <div className="p-2 w-12"></div>
            <div className="p-1 flex-grow text-left">ITEM NAME <br />Description</div>
            <div className="p-2 w-24 text-center">HSN CODE</div>
            <div className="p-2 flex-1 text-center">QTY.</div>
            <div className="p-2 flex-1 text-right">AMOUNT</div>
          </div>
          {items.map((item, index) => (
            <div key={index} className="flex border-t border-b">
              <div className="p-2 w-12 text-left">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="p-2 flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className="p-2 w-24 text-center">{item.hsnCode || '-'}</div>
              <div className="p-2 w-24 text-right">{item.quantity}</div>
              <div className="p-2 flex-1 text-right">
                {formatCurrency(item.total, selectedCurrency)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between" data-pdf-section="totals">
          <div className="w-2/3 p-4">
            <h3 className="text-lg font-semibold">Notes</h3>
            <p className="text-sm text-gray-600">{notes}</p>
          </div>
          <div className="w-1/3">
            <div className="flex justify-between mb-2 p-2">
              <span>Sub Total:</span>
              <span>{formatCurrency(subTotal, selectedCurrency)}</span>
            </div>

            {showDiscount && discountAmount > 0 && (
              <div className="flex justify-between mb-2 p-2 text-red-600">
                <span>Discount:</span>
                <span>-{formatCurrency(discountAmount, selectedCurrency)}</span>
              </div>
            )}

            {gstType === "SGST_CGST" ? (
              <>
                <div className="flex justify-between mb-2 p-2">
                  <span>SGST ({gstRate / 2}%):</span>
                  <span>{formatCurrency(sgstAmount, selectedCurrency)}</span>
                </div>
                <div className="flex justify-between mb-2 p-2">
                  <span>CGST ({gstRate / 2}%):</span>
                  <span>{formatCurrency(cgstAmount, selectedCurrency)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between mb-2 p-2">
                <span>IGST ({gstRate}%):</span>
                <span>{formatCurrency(igstAmount, selectedCurrency)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold bg-blue-500 text-white p-2 mt-4">
              <span className="text-left">Total</span>
              <span>{formatCurrency(grandTotal, selectedCurrency)}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600 capitalize p-2">
              <strong>Amount in words:</strong> {numberToWords(grandTotal)}
            </div>

            {/* QR Code */}
            {showQrCode && qrCode && (
              <div className="mt-4 p-2">
                <h4 className="font-semibold mb-2">QR Code:</h4>
                <img src={qrCode} alt="QR Code" className="w-20 h-20 object-contain" />
              </div>
            )}
          </div>
        </div>

        {/* Bank Details */}
        {selectedBank && (
          <div className="mt-4 p-4" data-pdf-section="bank-details">
            <h4 className="font-semibold mb-2">Bank Details:</h4>
            <div className="text-sm">
              <p><strong>Bank:</strong> {selectedBank.bankName}</p>
              <p><strong>Account:</strong> {selectedBank.accountNumber}</p>
              <p><strong>IFSC:</strong> {selectedBank.ifscCode}</p>
            </div>
          </div>
        )}

        {/* Terms and Conditions */}
        {showTermsAndConditions && termsAndConditions && (
          <div className="mt-4 p-4" data-pdf-section="terms">
            <h4 className="font-semibold mb-2">Terms & Conditions:</h4>
            <p className="text-sm">{termsAndConditions}</p>
          </div>
        )}

        {/* Signature Section */}
        <div className="flex justify-end mt-8 p-4" data-pdf-section="signature">
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

export default Template3;
