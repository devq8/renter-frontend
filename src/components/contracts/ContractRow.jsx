import React from "react";
import { useNavigate } from "react-router";
import format from "../../utils/format";

function ContractRow({
  id,
  unit,
  property,
  tenant,
  status,
  flexible,
  start,
  end,
  rent,
  daysToExpire,
  amountDue,
}) {
  const navigate = useNavigate();
  function getStatus(contract_status) {
    if (contract_status === "Active") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
          Active
        </span>
      );
    } else if (contract_status === "Blocked") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
          Blocked
        </span>
      );
    } else if (contract_status === "Expired") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-600">
          Expired
        </span>
      );
    }
  }

  function handleContractDetails() {
    navigate(`/contracts/${id}`);
  }

  return (
    <tr
      className="hover:bg-gray-50"
      onClick={handleContractDetails}
      style={{
        cursor: "pointer",
      }}
    >
      <th className="px-4 py-4">
        <div className="text-sm">{id}</div>
      </th>
      <td className="px-4 py-4 text-gray-700 font-medium">
        {tenant.user.first_name} {tenant.user.last_name}
      </td>
      <td className="px-4 py-4">{unit.property_fk.name}</td>
      <td className="px-4 py-4">{unit.floor}</td>
      <td className="px-4 py-4">{unit.number}</td>
      <td className="px-4 py-4">{daysToExpire} Days</td>
      <td className="flex justify-end px-4 py-4 text-end">
        <div className="me-1">KD</div>
        <div>{amountDue && format.changeAmountFormat(amountDue, 0)}</div>
      </td>
      <td className="px-4 py-4 text-gray-700 font-medium text-end">
        {rent && `KD ${format.changeAmountFormat(rent, 0)}`}
      </td>
      <td className="px-4 py-4 flex justify-center items-center">
        {getStatus(status)}
      </td>
    </tr>
  );
}

export default ContractRow;
