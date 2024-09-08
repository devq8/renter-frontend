import { parseISO, format } from "date-fns";

export function changeAmountFormat(amount, decimal = 3) {
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

export function changeDatesFormat(date) {
  const dateObj = new Date(date);
  const newDateFormat = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return newDateFormat;
}

export function changeDateTimeFormat(date) {
  if (date === null || date === undefined) {
    return "";
  }
  const dateObj = parseISO(date);
  const newDateFormat = format(dateObj, "dd/MM/yyyy");
  const newTimeFormat = format(dateObj, "hh:mm a");
  return `${newDateFormat} - ${newTimeFormat}`;
}

export function modulo(divident, divisor) {
  let partLength = 10;

  while (divident.length > partLength) {
    let part = divident.substring(0, partLength);
    divident = (part % divisor) + divident.substring(partLength);
  }

  return divident % divisor;
}

export function validateIBAN(iban) {
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
}

export function getFileNameFromUrl(url) {
  // Create a URL object directly from the original URL
  const urlObject = new URL(url);
  // Get the encoded pathname part of the URL
  const pathname = urlObject.pathname;
  // Decode the pathname to get the original file name
  const decodedPathname = decodeURIComponent(pathname);
  // Extract the file name from the decoded pathname
  const fileNameWithExtension = decodedPathname.substring(
    decodedPathname.lastIndexOf("/") + 1
  );
  // Remove the file extension
  const fileName = fileNameWithExtension.substring(
    0,
    fileNameWithExtension.lastIndexOf(".")
  );
  return fileName;
}

// export default {
//   changeAmountFormat,
//   changeDatesFormat,
//   changeDateTimeFormat,
//   validateIBAN,
//   getFileNameFromUrl,
// };
