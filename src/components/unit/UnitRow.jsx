import React from "react";
import format from "../../utils/format";

function UnitRow({
  id,
  number,
  floor,
  type,
  vacant,
  tenantFirstName,
  tenantLastName,
  rent,
  startPeriod,
  endPeriod,
  overdueAmount,
}) {
  function handleDelete() {
    console.log("Handle Delete function called");
  }
  function handleEdit() {
    console.log("Handle Edit function called");
  }

  // const changeDatesFormat = (date) => {
  //   const dateObj = new Date(date);
  //   const newDateFormat = dateObj.toLocaleDateString("en-GB", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   });

  // return newDateFormat;
  // };

  return (
    <tr
      className="hover:bg-gray-50"
      //   onClick={handlePropertyDetails}
      style={{
        cursor: "pointer",
      }}
    >
      <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
        {/* <div className="relative h-10 w-10">
        <img
          className="h-full w-full rounded-full object-cover object-center"
          src="{profile}"
          alt=""
        />
      </div> */}
        <div className="text-sm">
          <div className="font-medium text-gray-700">{number}</div>
          {/* <div className="text-gray-300">ID {id}</div> */}
        </div>
      </th>
      <td className="px-6 py-4">{floor}</td>
      <td className="px-6 py-4">{type}</td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          {vacant ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-600">
              Vacant
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
              Occupied
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 font-medium text-gray-700">
        {tenantFirstName} {tenantLastName}
      </td>
      <td className="px-6 py-4">
        {rent && `KD ${format.changeAmountFormat(rent)}`}
      </td>
      <td className="px-6 py-4">
        {startPeriod
          ? `${format.changeDatesFormat(
              startPeriod
            )} - ${format.changeDatesFormat(endPeriod)}`
          : ""}
      </td>
      <td className="px-6 py-4 text-end">
        {rent &&
          (format.changeAmountFormat(overdueAmount)
            ? `KD ${format.changeAmountFormat(overdueAmount)}`
            : `KD -`)}
      </td>
    </tr>
  );
}

export default UnitRow;
