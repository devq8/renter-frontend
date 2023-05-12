export default function Validation(values) {
  const errors = {};

  if (values.name === "") {
    errors.name = "Required";
  }
  if (values.email === "") {
    errors.email = "Required";
  }
  if (values.subject === "") {
    errors.subject = "Required";
  }
  if (values.message === "") {
    errors.message = "Required";
  }

  return errors;
}
