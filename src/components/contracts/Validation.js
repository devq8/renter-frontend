export default function Validation(values) {
  const errors = {};
  console.log("Check validation");
  if (values.property === "") {
    errors.property = "Property is required";
  }
  if (values.unit === "") {
    errors.unit = "Unit is required";
  }
  if (values.tenant === "") {
    errors.tenant = "Tenant is required";
  }
  if (values.start_date === "") {
    errors.start_date = "Contract start date is required";
  }
  if (values.end_date === "") {
    errors.end_date = "Contract end date is required";
  } else if (values.end_date <= values.start_date) {
    errors.end_date = "Contract end date must be after contract start date";
  }
  if (values.first_payment_date === "") {
    errors.first_payment_date = "Contract first payment date is required";
  }
  if (values.rent <= 0) {
    errors.rent = "Rent must be more than KD 0";
  }

  if (
    values.notification_method == "SMS" ||
    values.notification_method == "sms" ||
    values.notification_method == "WhatsApp" ||
    values.notification_method == "whatsapp"
  ) {
    if (values.notification_mobile === "") {
      errors.notification_mobile = "Mobile is required";
    }
  } else if (values.notification_method == "Email") {
    if (values.notification_email === "") {
      errors.notification_email = "Email is required";
    }
  }

  return errors;
}
