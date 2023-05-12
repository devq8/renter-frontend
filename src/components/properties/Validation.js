export default function Validation(values) {
  const errors = {};

  if (values.name === "") {
    errors.name = "Name is required";
  }
  if (values.area === "") {
    errors.area = "Area is required";
  }
  if (values.manager.length === 0) {
    errors.manager = "Manager is required";
  }
  if (values.owner.length === 0) {
    errors.owner = "Owner is required";
  }

  return errors;
}
