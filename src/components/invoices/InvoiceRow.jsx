import React from "react";
import { useNavigate } from "react-router";
import format from "../../utils/format";

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
            <span className="text-xs">
              {format.changeDatesFormat(paymentDate)}
            </span>
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
        {tenant.user.first_name} {tenant.user.last_name}
      </th>
      <td className="px-4 py-4">{property.name}</td>
      <td className="px-4 py-4">{floor}</td>
      <td className="px-4 py-4">{unit}</td>
      <td className="px-4 py-4 text-center">{type}</td>
      <td className="px-4 py-4 text-center">
        {format.changeDatesFormat(date)}
      </td>
      <td className="px-4 py-4 text-gray-700 font-medium text-end">
        {amount && `KD ${format.changeAmountFormat(amount)}`}
      </td>
      <td className="px-4 py-4 ">{showInvoiceStatus(status, paymentDate)}</td>
    </tr>
  );
}

export default InvoiceRow;
