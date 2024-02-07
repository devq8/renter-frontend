import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../utils/api/invoices";
import { changeAmountFormat, changeDatesFormat } from "../../utils/format";
import Button from "../../utils/Button";
import { BsFillBuildingFill } from "react-icons/bs";
import AttachmentItem from "../invoices/AttachmentItem";

function InvoiceView() {
  // const navigate = useNavigate();

  const { id: invoiceId } = useParams();

  const { data: invoice } = useQuery(["invoice", invoiceId], () =>
    api.getInvoiceDetails(invoiceId)
  );

  const invoiceDetails = invoice?.data;
  console.log(invoiceDetails);

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
    }
  }

  const documentsList = [
    <AttachmentItem fileName={"WaterConsumption.png"} deleteIcon={false} />,
    <AttachmentItem fileName={"invoice.pdf"} deleteIcon={false} />,
  ];
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center m-4">
        <h1 className="text-xl font-bold text-[#1C1F2A]">
          Invoice No. {invoiceDetails?.id}
        </h1>
        <span className="inline-flex items-center gap-1 rounded-md bg-[#F2F2F2] px-2 py-1 text-sm font-semibold text-[#52555C] border border-[1px] border-[#EBEBEB]">
          {invoiceDetails?.get_type_display}
        </span>
      </div>
      <h1 className="mx-4 my-2 font-bold text-base text-[#52555C]">
        Invoice Details
      </h1>
      <div className="bg-white rounded-md mx-4 mt-2 mb-0 ">
        <div className="flex justify-between p-4">
          <h1 className="text-base text-[#AEB3C2] font-bold">Total Amount</h1>
          <h1 className="text-base text-[#52555C] font-bold">
            KD {changeAmountFormat(invoiceDetails?.invoice_amount)}
          </h1>
        </div>
      </div>
      <div className="bg-white rounded-md mx-4 mb-2 mt-1 ">
        <div className="flex justify-between px-4 py-2">
          <h1 className="text-base text-[#AEB3C2] font-bold">Invoice Date</h1>
          <h1 className="text-base text-[#52555C] font-bold">
            {changeDatesFormat(invoiceDetails?.invoice_date)}
          </h1>
        </div>
        <div className="flex justify-between px-4 py-2">
          <h1 className="text-base text-[#AEB3C2] font-bold">From</h1>
          <h1 className="text-base text-[#52555C] font-bold">
            {changeDatesFormat(invoiceDetails?.from_date)}
          </h1>
        </div>
        <div className="flex justify-between px-4 py-2">
          <h1 className="text-base text-[#AEB3C2] font-bold">To</h1>
          <h1 className="text-base text-[#52555C] font-bold">
            {changeDatesFormat(invoiceDetails?.to_date)}
          </h1>
        </div>
        <div className="flex justify-center m-3">
          <Button color="#BD9A5F" text="Payment Link" type="link" />
        </div>
      </div>
      <div className="mx-4 mb-2 mt-6 font-bold text-base text-[#52555C]">
        <h1>Contract Details</h1>
        <div className="flex justify-start items-center bg-white rounded-md p-4">
          {/* Building Icon */}
          <div className="flex bg-[#F7F7F7] w-[48px] h-[48px] rounded-md items-center justify-center">
            <BsFillBuildingFill
              className="text-[#52555C]"
              style={{ fontSize: "28px" }}
            />
          </div>
          <div className="flex flex-col mx-4">
            <h1 className="text-[#52555C] text-base font-bold line-clamp-1">
              {invoiceDetails?.contract.unit.property_fk.name}
            </h1>
            <h1 className="text-[#52555C] font-bold text-xs line-clamp-1">
              {invoiceDetails?.contract.unit.get_unit_type_display}
            </h1>
          </div>
        </div>
        {/*  */}
        <div className="flex justify-start items-center bg-white rounded-md py-4 px-2 mt-0">
          <div className="flex flex-col mx-2">
            <h1 className="text-[#AEB3C2] text-xs font-bold line-clamp-1 py-2">
              Contract No.
            </h1>
            <h1 className="text-[#52555C] font-bold text-sm line-clamp-1">
              {invoiceDetails?.contract.id}
            </h1>
          </div>
          <div className="flex flex-col mx-2">
            <h1 className="text-[#AEB3C2] text-xs font-bold line-clamp-1 py-2">
              Unit No.
            </h1>
            <h1 className="text-[#52555C] font-bold text-sm line-clamp-1">
              {invoiceDetails?.contract.unit.number}
            </h1>
          </div>
          <div className="flex flex-col mx-2">
            <h1 className="text-[#AEB3C2] text-xs font-bold line-clamp-1 py-2">
              Tenant
            </h1>
            <h1 className="text-[#52555C] font-bold text-sm line-clamp-2">
              {invoiceDetails?.contract.tenant.user.first_name}{" "}
              {invoiceDetails?.contract.tenant.user.last_name}
            </h1>
          </div>
        </div>
        <h1 className="mt-6 mb-2 font-bold text-base text-[#52555C]">
          Payment Details
        </h1>
        <div className="bg-white rounded-md pb-2">
          <div className="flex justify-between items-center text-[#AEB3C2] text-sm pt-2 px-2">
            <h1 className="mx-2 py-2 font-bold">Status</h1>
            <h1 className="mx-2 py-2 font-bold">
              {showStatus(invoiceDetails?.get_invoice_status_display)}
            </h1>
          </div>
          <div className="flex justify-between text-[#AEB3C2] px-2 text-sm items-center">
            <h1 className="mx-2 py-2 font-bold">Payment Method</h1>
            <h1 className="mx-2 py-2 font-bold">
              {invoiceDetails?.method_of_payment}
            </h1>
          </div>
          <div className="flex justify-between text-[#AEB3C2] px-2 text-sm items-center">
            <h1 className="mx-2 py-2 font-bold">Reference ID</h1>
            <h1 className="mx-2 py-2 font-bold">
              {invoiceDetails?.reference_id}
            </h1>
          </div>
          <div className="flex justify-between text-[#AEB3C2] px-2 text-sm items-center">
            <h1 className="mx-2 py-2 font-bold">Reference Token</h1>
            <h1 className="mx-2 py-2 font-bold">
              {invoiceDetails?.reference_token}
            </h1>
          </div>
          <div className="flex justify-between text-[#AEB3C2] px-2 text-sm items-center">
            <h1 className="mx-2 py-2 font-bold">Payment Date & Time</h1>
            <h1 className="mx-2 py-2 font-bold">
              {invoiceDetails?.payment_date}
            </h1>
          </div>
        </div>
        {invoiceDetails?.description && (
          <>
            <h1 className="mt-6 mb-2 font-bold text-base text-[#52555C]">
              Description
            </h1>
            <div className="bg-white rounded-md pb-2">
              <div className="flex justify-between items-center text-[#AEB3C2] text-sm pt-2 px-2">
                <p className="mx-2 py-2 text-justify text-sm leading-relaxed">
                  For athletes, high altitude produces two contradictory effects
                  on performance. For explosive events (sprints up to 400
                  metres, long jump, triple jump) the reduction in atmospheric
                  pressure means there is less resistance from the atmosphere
                  and the athlete's performance will generally be better at high
                  altitude.
                </p>
              </div>
            </div>
          </>
        )}
        <h1 className="mt-6 mb-2 font-bold text-base text-[#52555C]">
          Attachments
        </h1>
        <div className="bg-white rounded-md pb-2 mb-1 flex justify-center items-center">
          <div className="flex justify-center items-center text-[#AEB3C2] text-sm pt-2 w-full h-full">
            <div className="w-full h-full px-5 py-3 space-y-4">
              {documentsList}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceView;
