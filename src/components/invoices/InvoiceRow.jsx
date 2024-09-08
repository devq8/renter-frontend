import React from "react";
import { useNavigate } from "react-router";
import { changeAmountFormat, changeDatesFormat } from "../../utils/format";

function InvoiceRow({
  id,
  tenant,
  property,
  floor,
  unit,
  type,
  date,
  amount,
  status,
  paymentDate,
}) {
  const navigate = useNavigate();

  function handleInvoiceDetails() {
    navigate(`/invoices/${id}`);
  }

  function showInvoiceStatus(status, paymentDate) {
    if (status == "Paid") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
          Paid
          {paymentDate ? (
            <span className="text-xs">{changeDatesFormat(paymentDate)}</span>
          ) : null}
        </span>
      );
    } else if (status == "Not Paid" || status == "Overdue") {
      return (
        <span className="inline-flex items-center justify-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
          {status}
        </span>
      );
    } else if (status == "Cancelled") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-600">
          {status}
        </span>
      );
    } else if (status == "Upcoming") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-600">
          {status}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-600">
          {status}
        </span>
      );
    }
  }

  return (
    <tr
      className="hover:bg-gray-50"
      onClick={handleInvoiceDetails}
      style={{
        cursor: "pointer",
      }}
    >
      <td className="px-4 py-4">{id}</td>
      <th className="px-4 py-4 text-gray-700 font-medium">
        {tenant.user.english_name}
      </th>
      <td className="px-4 py-4">{property.name}</td>
      <td className="px-4 py-4 text-center">{floor}</td>
      <td className="px-4 py-4 text-center">{unit}</td>
      <td className="px-4 py-4 text-left">{type}</td>
      <td className="px-4 py-4 text-center">{changeDatesFormat(date)}</td>
      <td className="px-4 py-4 text-gray-700 font-medium text-end">
        {amount && (
          <div className="flex justify-between">
            <div>KD</div>
            <div>{changeAmountFormat(amount)}</div>
          </div>
        )}
      </td>
      <td className="px-4 py-4 ">{showInvoiceStatus(status, paymentDate)}</td>
    </tr>
  );
}

export default InvoiceRow;
