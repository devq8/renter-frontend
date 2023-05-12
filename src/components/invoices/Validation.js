export default function Validation(invoice) {
  const errors = {};
  console.log("Check validation of the following invoice: ", invoice);
  if (invoice.contract === "") {
    errors.contract = "Contract is required";
  }
  if (invoice.type === "") {
    errors.type = "Invoice type is required";
  }
  if (invoice.invoice_title === "") {
    errors.invoice_title = "Title is required";
  }
  if (invoice.from_date === "") {
    errors.from_date = "From date is required";
  } else if (invoice.to_date <= invoice.from_date) {
    errors.to_date = '"To date" must be after "From date"';
  }
  if (invoice.to_date === "") {
    errors.to_date = "To date is required";
  }
  if (invoice.invoice_date === "") {
    errors.invoice_date = "Invoice date is required";
  }
  if (invoice.invoice_amount <= 0) {
    errors.invoice_amount = "Invoice amount must be more than KD 0";
  }

  return errors;
}
