import React from "react";
import { FaHandHoldingWater } from "react-icons/fa";
import { GiScales } from "react-icons/gi";
import {
  BsBuildingFill,
  BsRouterFill,
  BsShieldFill,
  BsFillLightningChargeFill,
  BsCashCoin,
  BsTools,
} from "react-icons/bs";

function ReceiptIcon({ type = "Rent" }) {
  function selectType(type) {
    if (type == "Rent") {
      return (
        <BsBuildingFill
          className="text-[#52555C]"
          style={{ fontSize: "28px" }}
        />
      );
    } else if (type == "Water") {
      return (
        <FaHandHoldingWater
          className="text-[#52555C]"
          style={{ fontSize: "28px" }}
        />
      );
    } else if (type == "Electricity") {
      return (
        <BsFillLightningChargeFill
          className="text-[#52555C]"
          style={{ fontSize: "28px" }}
        />
      );
    } else if (type == "Internet") {
      return (
        <BsRouterFill className="text-[#52555C]" style={{ fontSize: "28px" }} />
      );
    } else if (type == "Insurance") {
      return (
        <BsShieldFill className="text-[#52555C]" style={{ fontSize: "28px" }} />
      );
    } else if (type == "Admin Fees") {
      return (
        <BsCashCoin className="text-[#52555C]" style={{ fontSize: "28px" }} />
      );
    } else if (type == "Maintenance") {
      return (
        <BsTools className="text-[#52555C]" style={{ fontSize: "28px" }} />
      );
    } else if (type == "Legal Fees") {
      return (
        <GiScales className="text-[#52555C]" style={{ fontSize: "28px" }} />
      );
    }
  }

  return (
    <div className="flex bg-white w-[48px] h-[48px] rounded-md items-center justify-center">
      {selectType(type)}
    </div>
  );
}

export default ReceiptIcon;
