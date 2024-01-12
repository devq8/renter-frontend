import React from "react";
import { BsFillBuildingFill, BsReceipt } from "react-icons/bs";
import Checkbox from "@mui/material/Checkbox";

function CheckoutItem({
  invoiceId,
  title,
  type,
  amount,
  isChecked,
  disabled,
  onSelectionChange,
  defaultChecked,
}) {
  return (
    <li>
      {/* <input
        type="checkbox"
        id="invoice-item"
        className="hidden peer"
        checked={isChecked}
        disabled={disabled}
        onChange={onSelectionChange}
      /> */}
      <div //This should be a label tag
        htmlFor="invoice-item"
        className="inline-flex items-center justify-between w-full px-5 py-3 text-gray-500 bg-white border-2 border-gray-200 rounded-lg  dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-primary hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <div className="flex">
          <Checkbox
            // checked={isChecked}
            defaultChecked
            disabled={disabled}
            onChange={onSelectionChange}
          />
          {/* Type Icon */}
          <div className="flex bg-[#F7F7F7] w-[48px] h-[48px] rounded-md items-center justify-center">
            <BsReceipt
              className="text-[#52555C]"
              style={{ fontSize: "28px" }}
            />
          </div>
          <div className="flex items-center justify-between mx-2">
            <div className="flex-col">
              <div className="font-bold">{title}</div>
              <div className="text-gray-400">{type ? type : <br />}</div>
            </div>
          </div>
        </div>
        <div>KD {amount}</div>
      </div>
    </li>
    // </div>
  );
}

export default CheckoutItem;
