import instance from "./index";

export function paymentResponse(data = null, payment_id = null) {
  // console.log("Fn data:", data);
  // console.log("Fn Payment ID:", payment_id);
  let url = "/api/checkout/response/";
  let queryParams = [];

  if (data) {
    queryParams.push(`data=${data}`);
  } else if (payment_id) {
    queryParams.push(`payment_id=${payment_id}`);
  }

  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }

  // console.log("URL:", url);
  return instance.get(url);
}

export function sendPayment(data) {
  return instance.post("/api/checkout/request/", {
    amount: data.amount,
    orderReferenceNumber: data.orderReferenceNumber,
    paymentType: data.paymentType,
    variable1: data.variable1,
    variable2: data.variable2,
    variable3: data.variable3,
    variable4: data.variable4,
    variable5: data.variable5,
    invoices: data.invoices,
  });
}

export function getPaymentDetails(paymentId) {
  return instance.get(`/api/checkout/receipt/${paymentId}/`);
}

export function getPaymentsList(uid) {
  return instance.get(`/api/payments/?uid=${uid}`);
}

// Server-side paginated fetch for the payments table. Returns the raw DRF page
// body: { count, next, previous, results }. Filters applied on the backend
// (see AllPaymentsListView).
export function getAllPaymentsList({
  page = 1,
  pageSize = 20,
  search = "",
  status = "",
  paymentMethod = "",
} = {}) {
  const params = { page, page_size: pageSize };
  if (search) params.search = search;
  if (status) params.status = status;
  if (paymentMethod) params.payment_method = paymentMethod;

  return instance.get(`/api/payments/all/`, { params }).then((res) => res.data);
}

export function getCheckoutDetails(unique_payment_identifier) {
  return instance.get(`/api/checkout/${unique_payment_identifier}/`);
}
