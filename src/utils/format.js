function changeAmountFormat(amount, decimal = 3) {
  if (amount === null || amount === "0") {
    return 0;
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

export default { changeAmountFormat, changeDatesFormat };
