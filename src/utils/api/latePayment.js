import instance from "./index";

// Logged-in manager's own auto-block settings (backend: /api/late-payment-policy/).
export function getLatePaymentPolicy() {
  return instance.get(`/api/late-payment-policy/`).then((res) => res.data);
}

export function updateLatePaymentPolicy(policy) {
  return instance
    .put(`/api/late-payment-policy/`, policy)
    .then((res) => res.data);
}

// Remove the manager's own settings so the company default applies again.
export function resetLatePaymentPolicy() {
  return instance.delete(`/api/late-payment-policy/`).then((res) => res.data);
}
