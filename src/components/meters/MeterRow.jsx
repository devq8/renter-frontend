import React from "react";
import { useNavigate } from "react-router";
import { changeAmountFormat, changeDatesFormat } from "../../utils/format";

function MeterRow({ meter }) {
  console.log("Meter:", meter);

  function last_reading(meter) {
    if (meter.get_meter_type_display === "Water") {
      if (meter.get_water_unit_display === "Cubic Meter") {
        return (
          <>
            {changeAmountFormat(meter.last_reading, 0)} m<sup>3</sup>
          </>
        );
      } else if (meter.get_water_unit_display === "Imperial Gallon") {
        return <>{changeAmountFormat(meter.last_reading, 0)} gal</>;
      }
    }
  }

  const tenantList =
    meter.tenants.length > 1
      ? `${meter.tenants.length} tenants`
      : meter.tenants[0];

  const unitNumberList = meter.unit_number.join(" - ");

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
      <td className="px-4 py-4 text-center">{meter.get_meter_type_display}</td>
      <td className="px-4 py-4 text-right">{last_reading(meter)}</td>
      <td className="px-4 py-4 text-center">
        {changeDatesFormat(meter.last_reading_date)}
      </td>
      <td className="px-4 py-4 text-center">{`${meter.total_percentage} %`}</td>
      {/* <td className="px-4 py-4 text-left">{tenantList}</td> */}
      <td className="px-4 py-4 text-left">{unitNumberList}</td>
    </tr>
  );
}

export default MeterRow;
