import React from "react";
import {
  AiFillPlusCircle,
  AiFillEdit,
  AiFillBell,
  AiFillPrinter,
} from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoLinkSharp } from "react-icons/io5";

function Button({ color, text, type, className_, disabled, onClick }) {
  const className = `flex items-center rounded-md bg-[${color}] mx-2 px-7 py-3 text-base font-medium text-white transition duration-200 hover:bg-[${color}] hover:opacity-80 active:bg-[${color}] ${className_}`;

  return (
    <div className="hide-on-print">
      <button
        className={className}
        onClick={onClick}
        disabled={disabled}
        type="button"
      >
        <span className="inline-block mr-2 ">
          {type === "add" && <AiFillPlusCircle className="w-6 h-6" />}
          {type === "edit" && <AiFillEdit className="w-6 h-6" />}
          {type === "reminder" && <AiFillBell className="w-6 h-6" />}
          {type === "link" && <IoLinkSharp className="w-6 h-6" />}
          {type === "print" && <AiFillPrinter className="w-6 h-6" />}
          {type === "other" && <BsThreeDotsVertical className="w-6 h-6" />}
        </span>
        <span className="line-clamp-1">{text}</span>
      </button>
    </div>
  );
}

export default Button;
