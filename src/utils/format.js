function changeAmountFormat(amount, decimal = 3) {
  // console.log(`Amount: ${amount}`);
  // console.log(`Decimals: ${decimal}`);
  if (amount === null || amount === "0" || amount === 0) {
    const zeroWithDecimals = Number.parseFloat(0).toFixed(decimal);
    return zeroWithDecimals;
  } else {
    const amountFloat = parseFloat(amount);
    const amountDecimal = amountFloat.toFixed(decimal);
    const amountSeparator = amountDecimal
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return amountSeparator;
  }
}

const changeDatesFormat = (date) => {
  const dateObj = new Date(date);
  const newDateFormat = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return newDateFormat;
};

const changeDateTimeFormat = (date) => {
  const dateObj = new Date(date);
  const newDateFormat = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const newTimeFormat = dateObj.toLocaleTimeString();

  return `${newDateFormat} ${newTimeFormat}`;
};

function modulo(divident, divisor) {
  let partLength = 10;

  while (divident.length > partLength) {
    let part = divident.substring(0, partLength);
    divident = (part % divisor) + divident.substring(partLength);
  }

  return divident % divisor;
}

const validateIBAN = (iban) => {
  if (iban.length !== 30) {
    return false;
  }

  // Move first 4 characters to the end and replace letters with numbers
  let rearrainged = iban.slice(4) + iban.slice(0, 4);
  let numericIBAN = rearrainged
    .split("")
    .map((char) => {
      if (isNaN(char)) {
        return char.charCodeAt(0) - 55;
      } else {
        return char;
      }
    })
    .join("");

  // Check if remainder of division by 97 is 1
  return modulo(numericIBAN, 97) === 1;
};

export default {
  changeAmountFormat,
  changeDatesFormat,
  changeDateTimeFormat,
  validateIBAN,
};
