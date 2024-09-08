import React from "react";
import "../../index.css";
import NavBarLeft from "./NavBarLeft";
import NavBarRight from "./NavBarRight";
import demo from "../../assets/Starlight1.png";
import "./Signin.css";
import TextSlider from "./Slider";
import ForgetPasswordForm from "./ForgetPasswordForm";

function ForgetPassword() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-[40%]">
        <NavBarLeft />
        <div className="h-[90%] flex justify-center items-center ">
          <ForgetPasswordForm />
        </div>
      </div>
      <div className="w-full md:w-[60%] bg-[#F7F6F2]">
        <NavBarRight />
        <div className="h-[50vh] md:h-[70vh] flex justify-end items-center">
          <img src={demo} className="" />
        </div>
        <TextSlider />
      </div>
    </div>
  );
}

export default ForgetPassword;
