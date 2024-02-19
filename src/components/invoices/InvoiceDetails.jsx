import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import Breadcrumb from "../../utils/Breadcrumb";
import Button from "../../utils/Button";
import { getInvoiceDetails } from "../../utils/api/invoices";
import { changeDatesFormat, changeAmountFormat } from "../../utils/format";
import { PhotoIcon } from "@heroicons/react/24/solid";
import AttachmentItem from "./AttachmentItem";
// import HesabeCrypt from "hesabe-crypt";
// import aesjs from "aes-js";

function InvoiceDetails() {
  const navigate = useNavigate();

  const { id: invoiceId } = useParams();

  const {
    data: invoice,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useQuery(["invoice", invoiceId], () => getInvoiceDetails(invoiceId));

  const invoiceDetails = invoice?.data;
  console.log("Invoice Details", invoiceDetails);

  function showStatus(status) {
    if (status === "Paid") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-sm font-semibold text-green-600">
          Paid
        </span>
      );
    } else if (status === "New") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-600">
          New
        </span>
      );
    } else if (status === "Overdue") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-sm font-semibold text-red-600">
          Overdue
        </span>
      );
    } else if (status === "Cancelled") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-sm font-semibold text-gray-600">
          Cancelled
        </span>
      );
    } else if (status === "Upcoming") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-1 text-sm font-semibold text-yellow-600">
          Upcoming
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-sm font-semibold text-red-600">
          Pending
        </span>
      );
    }
  }

  function handleFileInput() {}

  function handlePayment() {
    console.log("redirecting to payment page");
    navigate(`/contracts/${invoiceDetails?.contract.id}/checkout`);
  }

  function handlePrintInvoice() {
    navigate(`/invoices/${invoiceDetails?.payment?.id}/receipt`);
  }

  const documentsList =
    invoiceDetails?.documents?.map((document, index) => {
      return (
        <AttachmentItem
          key={index}
          id={document.id}
          invoiceID={invoiceDetails?.id}
          description={document.description}
          fileUrl={document.file}
          deleteIcon={true}
        />
      );
    }) || [];

  return (
    <div className="h-[100%] pb-5">
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb
            main={{ title: "Invoices", url: "/invoices" }}
            sub={[
              { title: `Invoice No. ${invoiceDetails?.id} Details`, url: "" },
            ]}
          />
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#1C1F2A]">
              Invoice No. {invoiceDetails?.id} Details
            </h1>
            <div
            // onClick={() => navigate("/contract/new")}
            >
              {invoiceDetails && invoiceDetails.invoice_status !== "Paid" && (
                <Button
                  text="Send Reminder"
                  type="reminder"
                  className_={"bg-[#52555C]"}
                />
              )}
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-8 my-5">
          <div className="flex flex-col bg-white rounded-md p-5">
            <div className="flex items-center justify-between p-3 text-3xl font-bold text-[#52555C]">
              <h1 className="mx-2">{invoiceDetails?.invoice_title}</h1>
              {!invoiceDetails?.payment ? (
                <Button
                  color="#BD9A5F"
                  text="Payment Link"
                  type="link"
                  onClick={handlePayment}
                />
              ) : (
                <Button
                  color="#BD9A5F"
                  text="Print Invoice"
                  type="print"
                  onClick={handlePrintInvoice}
                />
              )}
            </div>
            <div className="flex bg-[#F7F7F7] h-[90px] rounded-md mx-5 items-start justify-between">
              <div className="flex flex-col items-start justify-center my-5 mx-2 pl-4">
                <h1 className="text-[#AEB3C2] text-sm font-bold">Type</h1>
                <h1 className="text-[#52555C] font-bold text-xl line-clamp-1 ">
                  {invoiceDetails?.get_invoice_type_display}
                </h1>
              </div>
              <div className="flex flex-col items-start justify-center my-5 mx-2 pl-5 border-l">
                <h1 className="text-[#AEB3C2] text-sm font-bold">
                  Invoice Date
                </h1>
                <h1 className="text-[#52555C] font-bold text-xl line-clamp-1">
                  {changeDatesFormat(invoiceDetails?.invoice_date)}
                </h1>
              </div>
              <div className="flex flex-col items-start justify-center my-5 mx-2 pl-5 pr-10 border-l">
                <h1 className="text-[#AEB3C2] text-sm font-bold">Period</h1>
                <h1 className="text-[#52555C] font-bold text-xl line-clamp-1 ">
                  {changeDatesFormat(invoiceDetails?.from_date)} -{" "}
                  {changeDatesFormat(invoiceDetails?.to_date)}
                </h1>
              </div>
              <div className="flex flex-col items-start justify-center my-5 mx-2 pl-5 pr-10 border-l">
                <h1 className="text-[#AEB3C2] text-sm font-bold">Amount</h1>
                <h1 className="text-[#52555C] font-bold text-xl line-clamp-1 ">
                  KD {changeAmountFormat(invoiceDetails?.invoice_amount)}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="flex mx-auto max-w-7xl px-8 my-5">
          <div className="bg-white rounded-md p-5 w-[50%] me-3">
            <h1 className="mx-2 text-3xl font-bold text-[#52555C]">
              Contract Details
            </h1>
            <div className="flex justify-between text-[#52555C] pt-2">
              <h1 className="mx-2 py-2 font-bold">Contract No.</h1>
              <a
                className="mx-2 py-2 font-bold"
                style={{
                  cursor: "pointer",
                  color: "#BD9A5F",
                  textDecoration: "underline",
                }}
                onClick={() =>
                  navigate(`/contracts/${invoiceDetails?.contract.id}`)
                }
              >
                {invoiceDetails?.contract.id}
              </a>
            </div>
            <div className="flex justify-between text-[#52555C]">
              <h1 className="mx-2 py-2 font-bold">Tenant Name</h1>
              <h1 className="mx-2 py-2 font-bold">
                {invoiceDetails?.contract.tenant.user.first_name}{" "}
                {invoiceDetails?.contract.tenant.user.last_name}
              </h1>
            </div>
            <div className="flex justify-between text-[#52555C]">
              <h1 className="mx-2 py-2 font-bold">Property</h1>
              <h1 className="mx-2 py-2 font-bold">
                {invoiceDetails?.contract.unit.property_fk.name}
              </h1>
            </div>
            <div className="flex justify-between text-[#52555C]">
              <h1 className="mx-2 py-2 font-bold">Unit</h1>
              <h1 className="mx-2 py-2 font-bold">
                {invoiceDetails?.contract.unit.number}
              </h1>
            </div>
            <div className="flex justify-between text-[#52555C]">
              <h1 className="mx-2 py-2 font-bold">Floor</h1>
              <h1 className="mx-2 py-2 font-bold">
                {invoiceDetails?.contract.unit.floor}
              </h1>
            </div>
          </div>
          <div className="bg-white rounded-md p-5 w-[50%] ms-3">
            <h1 className="mx-2 text-3xl font-bold text-[#52555C]">
              Payment Details
            </h1>
            <div className="flex justify-between text-[#52555C] pt-2">
              <h1 className="mx-2 py-2 font-bold">Status</h1>
              <h1 className="mx-2 py-2 font-bold">
                {showStatus(invoiceDetails?.invoice_status)}
              </h1>
            </div>
            <div className="flex justify-between text-[#52555C]">
              <h1 className="mx-2 py-2 font-bold">Payment Method</h1>
              <h1 className="mx-2 py-2 font-bold">
                {invoiceDetails?.payment?.payment_method}
              </h1>
            </div>
            <div className="flex justify-between text-[#52555C]">
              <h1 className="mx-2 py-2 font-bold">Reference ID</h1>
              <h1 className="mx-2 py-2 font-bold">
                {invoiceDetails?.payment?.reference_id}
              </h1>
            </div>
            <div className="flex justify-between text-[#52555C]">
              <h1 className="mx-2 py-2 font-bold">Reference Token</h1>
              <h1 className="mx-2 py-2 font-bold">
                {invoiceDetails?.payment?.reference_token}
              </h1>
            </div>
            <div className="flex justify-between text-[#52555C]">
              <h1 className="mx-2 py-2 font-bold">Payment Date & Time</h1>
              <h1 className="mx-2 py-2 font-bold">
                {invoiceDetails?.payment?.payment_date}
              </h1>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-8 ">
          {invoiceDetails?.description && (
            <div className="flex flex-col bg-white rounded-md p-5 ">
              <h1 className="mx-2 text-3xl font-bold text-[#52555C]">
                Description
              </h1>
              <p className="mx-2 my-3 text-base text-justify">
                {invoiceDetails?.description}
              </p>
            </div>
          )}
          <div className="flex flex-col bg-white rounded-md p-5 mt-5">
            <h1 className="mx-2 text-3xl font-bold text-[#52555C]">
              Attachments
            </h1>
            <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-3 mx-3 my-5">
              <div className="text-center">
                <PhotoIcon
                  className="mx-auto h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
                <div className="mt-4 flex items-center text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file"
                      type="file"
                      onChange={handleFileInput}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  PDF, PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            {documentsList.length > 0 && (
              <div>
                <h1 className="mx-3 text-base font-bold text-[#52555C]">
                  Uploaded Documents
                </h1>
                <div className="p-5 space-y-4">{documentsList}</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default InvoiceDetails;
