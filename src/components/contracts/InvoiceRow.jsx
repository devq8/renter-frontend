import React from "react";
import { useNavigate } from "react-router";
import { changeDatesFormat, changeAmountFormat } from "../../utils/format";

function InvoiceRow({
  id,
  type,
  date,
  title,
  start,
  end,
  amount,
  status,
  paymentDate,
}) {
  function designStatus(invoiceStatus, paymentDate) {
    if (invoiceStatus === "Paid") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
          Paid
          {paymentDate ? (
            <span className="text-xs">{changeDatesFormat(paymentDate)}</span>
          ) : null}
        </span>
      );
    } else if (invoiceStatus === "Overdue") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
          {invoiceStatus}
        </span>
      );
    } else if (invoiceStatus === "Cancelled") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-600">
          {invoiceStatus}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-600">
          {invoiceStatus}
        </span>
      );
    }
  }

  const navigate = useNavigate();

  return (
    <tr
      className="hover:bg-gray-50"
      onClick={() => navigate(`/invoices/${id}`)}
      style={{
        cursor: "pointer",
      }}
    >
      <td className="px-4 py-4">{id}</td>
      <th className="px-4 py-4 text-gray-700 font-medium">
        {changeDatesFormat(date)}{" "}
      </th>
      <td className="px-4 py-4">{title}</td>
      <td className="px-4 py-4">
        {changeDatesFormat(start)} - {changeDatesFormat(end)}
      </td>
      <td className="flex justify-end items-center px-4 py-4">
        {amount && `KD ${changeAmountFormat(amount)}`}
      </td>
      <td className="px-4 py-4 text-center">
        {designStatus(status, paymentDate)}
      </td>
      {/* <td className="px-4 py-4 text-center">
        {paymentDate && changeDatesFormat(paymentDate)}
      </td> */}
    </tr>
  );
}

export default InvoiceRow;
