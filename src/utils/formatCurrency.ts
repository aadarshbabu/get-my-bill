export const formatCurrency = (amount, currencyCode = 'INR', minimumFractionDigits = 2) => {
  const locale = currencyCode === 'USD' ? 'en-US' : 'en-IN';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode, minimumFractionDigits }).format(amount);
};
