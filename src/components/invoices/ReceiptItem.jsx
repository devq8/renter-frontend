import React from "react";
import { getInvoiceDetails } from "../../utils/api/invoices";
import { useQuery } from "@tanstack/react-query";
import { changeDatesFormat, changeAmountFormat } from "../../utils/format";
import ReceiptIcon from "./ReceiptIcon";

function ReceiptItem({ invoiceId }) {
  const { data: invoice } = useQuery(["invoices", invoiceId], () =>
    getInvoiceDetails(invoiceId)
  );

  const invoiceDetails = invoice?.data;

  return (
    <li>
      <input
        type="checkbox"
        id="invoice-item"
        value=""
        className="hidden peer"
        required=""
      />
      <div //This should be a label tag
        htmlFor="invoice-item"
        className="inline-flex items-center justify-between w-full px-5 pt-5 pb-1 mb-3 text-gray-500 bg-[#F7F7F7] border border-gray-200 rounded-lg  dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-primary hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <div className="flex flex-col w-full">
          {/* First Row */}
          <div className="flex">
            {/* Type Icon */}
            <div className="flex bg-white w-[48px] h-[48px] rounded-md items-center justify-center">
              <ReceiptIcon type={invoiceDetails?.get_invoice_type_display} />
            </div>
            <div className="flex items-center justify-between mx-2">
              <div className="flex-col mx-2">
                <div className="font-bold">{invoiceDetails?.invoice_title}</div>
                <div className="text-gray-400 text-sm">
                  {invoiceDetails?.get_invoice_type_display}
                </div>
              </div>
            </div>
          </div>
          <hr className="my-5" />
          <div className="space-y-2">
            <div className="flex justify-between mx-10">
              <h1 className="text-[#AEB3C2]">Period</h1>
              <h1 className="text-secondary">
                {`${changeDatesFormat(
                  invoiceDetails?.from_date
                )} - ${changeDatesFormat(invoiceDetails?.to_date)}`}
              </h1>
            </div>
            <div className="flex justify-between mx-10">
              <h1 className="text-[#AEB3C2]">Due Date</h1>
              <h1 className="text-secondary">
                {changeDatesFormat(invoiceDetails?.from_date)}
              </h1>
            </div>
            {invoiceDetails?.description && (
              <div className="flex flex-col justify-between mx-10 pb-3">
                <h1 className="text-[#AEB3C2] mb-3">Description</h1>
                <h1 className="text-secondary text-justify">
                  {invoiceDetails?.description}
                </h1>
              </div>
            )}

            <hr />
            <div className="flex justify-between mx-10 py-3">
              <h1 className="text-[#AEB3C2] font-bold">Amount</h1>
              <h1 className="text-secondary text-lg font-semibold">
                {`KD ${changeAmountFormat(invoiceDetails?.invoice_amount)}`}
              </h1>
            </div>
          </div>
        </div>
        {/* <div>KD {invoiceDetails.invoice_amount}</div> */}
      </div>
    </li>
  );
}

export default ReceiptItem;
