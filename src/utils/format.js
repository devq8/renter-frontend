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

export default { changeAmountFormat, changeDatesFormat, changeDateTimeFormat };
