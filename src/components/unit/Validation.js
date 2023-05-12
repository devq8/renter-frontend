export default function Validation(values) {
  const errors = {};

  if (values.number === "") {
    errors.number = "Unit number is required";
  }
  if (values.unit_type === "") {
    errors.unit_type = "Unit type is required";
  }
  if (values.floor === "") {
    errors.floor = "Floor is required";
  }

  return errors;
}
