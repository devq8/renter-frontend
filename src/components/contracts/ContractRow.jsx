import React from "react";
import { useNavigate } from "react-router";
import { changeAmountFormat } from "../../utils/format";

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
    if (contract_status === "ACTIVE") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
          Active
        </span>
      );
    } else if (contract_status === "BLOCKED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
          Blocked
        </span>
      );
    } else if (contract_status === "EXPIRED") {
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
        {tenant.user.english_name}
      </td>
      <td className="px-4 py-4">{unit.property_fk.name}</td>
      <td className="px-4 py-4">{unit.floor}</td>
      <td className="px-4 py-4">{unit.number}</td>
      {daysToExpire <= 0 ? (
        <td className="text-red-700 px-4 py-4">Expired</td>
      ) : (
        <td className="px-4 py-4">{daysToExpire} Days</td>
      )}
      <td className="flex justify-between px-4 py-4 text-end">
        <div className="me-1">KD</div>
        <div>{amountDue && changeAmountFormat(amountDue, 0)}</div>
      </td>
      <td className="px-4 py-4 text-gray-700 font-medium text-end">
        {rent && (
          <div className="flex justify-between">
            <div>KD</div>
            <div>{changeAmountFormat(rent, 0)}</div>
          </div>
        )}
      </td>
      <td className="px-4 py-4 flex justify-center items-center">
        {getStatus(status)}
      </td>
    </tr>
  );
}

export default ContractRow;
