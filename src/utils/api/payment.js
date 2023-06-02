import instance from "./index";

function paymentResponse(data) {
  return instance.get(`/api/checkout/response/?data=${data}`);
}

function sendPayment(data) {
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

function paymentDetails(paymentId) {
  return instance.get(`/api/checkout/receipt/${paymentId}/`);
}

export default {
  paymentResponse,
  sendPayment,
  paymentDetails,
};
