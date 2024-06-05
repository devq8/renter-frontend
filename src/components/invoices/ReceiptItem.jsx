import React from "react";
import { changeDatesFormat, changeAmountFormat } from "../../utils/format";
import ReceiptIcon from "./ReceiptIcon";

function ReceiptItem({ invoice }) {
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
          <div className="flex justify-between lg:mx-10 sm:mx-2">
            {/* Type Icon */}
            <div className="flex ">
              <div className="flex bg-white w-[48px] h-[48px] rounded-md items-center justify-center">
                <ReceiptIcon type={invoice.invoice_type} />
              </div>
              <div className="flex items-center justify-between mx-2">
                <div className="flex-col mx-2">
                  <div className="font-bold">
                    {invoice.contract.unit.property_fk.name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {invoice?.contract.unit.number}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-5 lg:mx-10 sm:mx-2" />
          <div className="flex-col lg:mx-10 sm:mx-2">
            <div className="font-bold">{invoice.invoice_title}</div>
            <div className="text-gray-400 text-sm">{invoice.invoice_type}</div>
          </div>
          <hr className="my-5 lg:mx-10 sm:mx-2" />
          <div className="space-y-2">
            <div className="flex justify-between lg:mx-10 sm:mx-2">
              <h1 className="text-[#AEB3C2]">Period</h1>
              <h1 className="text-secondary">
                {`${changeDatesFormat(invoice.from_date)} - ${changeDatesFormat(
                  invoice.to_date
                )}`}
              </h1>
            </div>
            <div className="flex justify-between lg:mx-10 sm:mx-2">
              <h1 className="text-[#AEB3C2]">Due Date</h1>
              <h1 className="text-secondary">
                {changeDatesFormat(invoice.due_date)}
              </h1>
            </div>
            {invoice.description && (
              <div className="flex flex-col justify-between lg:mx-10 sm:mx-2 pb-3">
                <h1 className="text-[#AEB3C2] mb-3">Description</h1>
                <h1 className="text-secondary text-justify">
                  {invoice.description}
                </h1>
              </div>
            )}

            <hr className="lg:mx-10 sm:mx-2" />
            <div className="flex flex-col space-y-4 py-3 lg:mx-10 sm:mx-2">
              <div className="flex justify-between">
                <h1 className="text-[#AEB3C2] font-bold">Amount</h1>
                <h1 className="text-secondary text-lg font-semibold">
                  {`KD ${changeAmountFormat(invoice.invoice_amount)}`}
                </h1>
              </div>
            </div>
          </div>
        </div>
        {/* <div>KD {invoiceDetails.invoice_amount}</div> */}
      </div>
    </li>
  );
}

export default ReceiptItem;
