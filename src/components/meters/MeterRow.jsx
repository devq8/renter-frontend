import React from "react";
import { useNavigate } from "react-router";
import { changeAmountFormat, changeDatesFormat } from "../../utils/format";

function MeterRow({ meter }) {
  return (
    <tr
      className="hover:bg-gray-50"
      //   onClick={handleInvoiceDetails}
      style={{
        cursor: "pointer",
      }}
    >
      <td className="px-4 py-4 text-left">{meter.property_fk}</td>
      <th className="px-4 py-4 text-gray-700 font-medium text-center">
        {meter.meter_number}
      </th>
      <td className="px-4 py-4 text-center">
        {meter.meter_type.charAt(0).toUpperCase() + meter.meter_type.slice(1)}
      </td>
      <td className="px-4 py-4 text-right">
        {changeAmountFormat(meter.last_reading, 0)}
      </td>
      <td className="px-4 py-4 text-center">
        {changeDatesFormat(meter.last_reading_date)}
      </td>
      <td className="px-4 py-4 text-left">
        {meter.contract && meter.contract.tenant.user.english_name}
      </td>
    </tr>
  );
}

export default MeterRow;
