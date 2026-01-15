
export const numberToWords = (amount) => {
  if (amount === 0) return "zero";
  
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const thousands = ["", "thousand", "million", "billion"];

  function convertHundreds(num) {
    let result = "";
    
    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + " hundred ";
      num %= 100;
    }
    
    if (num >= 20) {
      result += tens[Math.floor(num / 10)] + " ";
      num %= 10;
    } else if (num >= 10) {
      result += teens[num - 10] + " ";
      return result;
    }
    
    if (num > 0) {
      result += ones[num] + " ";
    }
    
    return result;
  }

  function convert(num) {
    if (num === 0) return "";
    
    let result = "";
    let thousandCounter = 0;
    
    while (num > 0) {
      if (num % 1000 !== 0) {
        result = convertHundreds(num % 1000) + thousands[thousandCounter] + " " + result;
      }
      num = Math.floor(num / 1000);
      thousandCounter++;
    }
    
    return result.trim();
  }

  // Handle decimal part
  const parts = amount.toString().split('.');
  const wholePart = parseInt(parts[0]);
  const decimalPart = parts[1] ? parseInt(parts[1].padEnd(2, '0').slice(0, 2)) : 0;
  
  let result = convert(wholePart);
  
  if (decimalPart > 0) {
    result += " and " + convert(decimalPart) + " cents";
  }
  
  return result + " only";
};
