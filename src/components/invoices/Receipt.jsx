import React from "react";
import { useParams } from "react-router";
import { getPaymentDetails } from "../../utils/api/payment";
import { getInvoiceDetails } from "../../utils/api/invoices";
import { useQuery } from "@tanstack/react-query";
import ReceiptItem from "./ReceiptItem";
import SimpleLogo from "../../assets/logo-simple.png";
import Button from "../../utils/Button";
import { changeDateTimeFormat, changeAmountFormat } from "../../utils/format";

function Receipt() {
  const { paymentid } = useParams();

  const { data: paymentData } = useQuery(["payment", paymentid], () =>
    getPaymentDetails(paymentid)
  );

  const paymentDetails = paymentData?.data;

  const invoices = paymentDetails?.invoices;

  const totalAmount = invoices?.reduce(
    (sum, invoice) => sum + (parseFloat(invoice.invoice_amount) || 0),
    0
  );
  const totalDiscount = invoices?.reduce(
    (sum, invoice) => sum + (parseFloat(invoice.discount_value) || 0),
    0
  );
  const totalPayable = invoices?.reduce(
    (sum, invoice) => sum + (parseFloat(invoice.payable_amount) || 0),
    0
  );

  const invoicesList = invoices?.map((invoice) => (
    <ReceiptItem key={invoice.id} invoice={invoice} />
  ));

  const handlePrint = () => {
    window.print();
  };

  function showInvoiceStatus(status) {
    if (status == "CAPTURED" || status == "captured") {
      return (
        <span className="inline-flex items-center justify-center gap-1 rounded-full bg-green-100 px-4 py-1 text-md font-semibold text-green-500">
          CAPTURED
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center justify-center gap-1 rounded-full bg-red-100 px-4 py-1 text-md font-semibold text-red-500">
          {status}
        </span>
      );
    }
  }

  return (
    <div className="bg-white mx-auto max-w-4xl rounded-lg shadow-sm mb-6">
      <div className="flex flex-col justify-center items-center m-6 p-6">
        <img src={SimpleLogo} className="pt-6 pb-6 h-36" />
        <h1 className="text-3xl font-semibold text-[#1C1F2A]">
          Payment Receipt
        </h1>
        <div className="flex items-center justify-center">
          <h3 className="mt-5 me-3">Receipt #{paymentDetails?.id}</h3>
          <h3 className="mt-5 ms-3">{`${changeDateTimeFormat(
            paymentDetails?.payment_date
          )}`}</h3>
        </div>
      </div>
      <hr className="my-4 lg:mx-10 sm:mx-2" />
      <div className="mx-auto max-w-2xl px-8 mt-10 my-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-[#AEB3C2]">Tenant</h1>
          <h1 className="text-xl font-bold text-secondary">{`${paymentDetails?.tenant_name}`}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-8 mt-10 my-6 space-y-6">
        <ul className="flex-col space-y-3 w-full gap-6 ">
          {invoicesList?.length < 1 ? <h1>No Items</h1> : invoicesList}
        </ul>
      </div>
      <hr className="my-4 lg:mx-10 sm:mx-2" />
      <div className="px-8">
        <h1 className="mx-auto max-w-xl my-8 text-2xl font-bold">
          Payment Information
        </h1>
        <div className="mx-auto max-w-xl p-6 space-y-5 bg-[#F7F7F7] rounded-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-[#AEB3C2] me-2">
              Status
            </h1>
            <h1 className="text-xl font-bold text-secondary text-clip overflow-hidden">
              {showInvoiceStatus(paymentDetails?.payment_status)}
            </h1>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl text-[#AEB3C2] me-2">Total Amount</h1>
            <h1 className="text-xl text-secondary text-clip overflow-hidden">
              {`KD ${changeAmountFormat(totalAmount)}`}
            </h1>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl text-[#AEB3C2] me-2">Discount</h1>
            <h1 className="text-xl text-secondary text-clip overflow-hidden">
              {`KD ${changeAmountFormat(totalDiscount)}`}
            </h1>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-[#AEB3C2] me-2">
              Paid Amount
            </h1>
            <h1 className="text-xl font-bold text-secondary text-clip overflow-hidden">
              {`KD ${changeAmountFormat(totalPayable)}`}
            </h1>
          </div>
          <hr className="my-4 mx-4" />
          <div className="flex justify-between items-center">
            <h1 className="text-xl text-[#AEB3C2] me-2">Method</h1>
            <h1 className="text-xl text-secondary text-clip overflow-hidden">
              {paymentDetails?.payment_method}
            </h1>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl text-[#AEB3C2] me-2">Token</h1>
            <h1 className="text-xl text-secondary text-clip overflow-hidden">
              {paymentDetails?.reference_token}
            </h1>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl text-[#AEB3C2] me-2">Payment ID</h1>
            <h1 className="text-xl text-secondary text-clip overflow-hidden">
              {paymentDetails?.reference_id}
            </h1>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl text-[#AEB3C2] me-2">Authorization ID</h1>
            <h1 className="text-xl text-secondary text-clip overflow-hidden">
              {paymentDetails?.authorization_id}
            </h1>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl text-[#AEB3C2] me-2">Transaction ID</h1>
            <h1 className="text-xl text-secondary text-clip overflow-hidden">
              {paymentDetails?.transaction_id}
            </h1>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl text-[#AEB3C2] me-2">Bank Reference</h1>
            <h1 className="text-xl text-secondary text-clip overflow-hidden">
              {paymentDetails?.bank_reference}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-10">
        <Button
          text="Print"
          type="print"
          className_="bg-primary"
          onClick={handlePrint}
        />
      </div>
    </div>
  );
}

export default Receipt;
