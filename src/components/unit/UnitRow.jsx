import React from "react";
import { changeAmountFormat, changeDatesFormat } from "../../utils/format";
import { AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router";

function UnitRow({
  id,
  number,
  property,
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
  const navigate = useNavigate();
  // function handleDelete() {
  //   console.log("Handle Delete function called");
  // }
  function handleEdit() {
    navigate(`/properties/${property}/units/${id}/update`);
  }

  return (
    <>
      <style>
        {`
          .action-icons {
            visibility: hidden;
          }

          tr:hover .action-icons {
            visibility: visible;
          }
        `}
      </style>

      <tr
        className="hover:bg-gray-50 relative"
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
          {rent && `KD ${changeAmountFormat(rent, 0)}`}
        </td>
        <td className="px-6 py-4">
          {startPeriod
            ? `${changeDatesFormat(startPeriod)} - ${changeDatesFormat(
                endPeriod
              )}`
            : ""}
        </td>
        <td className="px-6 py-4 text-end">
          {overdueAmount ? (
            <div className="flex justify-between">
              <div>KD </div>
              <div>{changeAmountFormat(overdueAmount)}</div>{" "}
            </div>
          ) : (
            <div className="flex justify-between">
              <div>KD </div>
              <div>-</div>
            </div>
          )}
        </td>
        <td className="px-6 py-4 text-center action-icons">
          <button onClick={handleEdit} className="inline-block items-center">
            <AiFillEdit className="w-6 h-6" />
          </button>
        </td>
        {/* <td className="px-6 py-4 text-center action-icons">
          <button onClick={handleDelete} className="inline-block items-center">
            <AiFillDelete className="w-6 h-6" />
          </button>
        </td> */}
      </tr>
    </>
  );
}

export default UnitRow;
