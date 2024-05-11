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
  console.log("Im in sendPayment function");
  console.log(data);

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

export function getCheckoutDetails(unique_payment_identifier) {
  return instance.get(`/api/checkout/${unique_payment_identifier}/`);
}
