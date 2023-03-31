import React from "react";
import "../../index.css";
import NavBarLeft from "./NavBarLeft";
import NavBarRight from "./NavBarRight";
import demo from "../../assets/Starlight1.png";
import "./Signin.css";
import TextSlider from "./Slider";
import SigninForm from "./SigninForm";

function Signin() {
  return (
    <div className="flex h-[100vh]">
      <div className="w-[40%]">
        <NavBarLeft />
        <div className="h-[90%] flex justify-center items-center ">
          <SigninForm />
        </div>
      </div>
      <div className="w-[60%] bg-[#F7F6F2]">
        <NavBarRight />
        <div className="h-[70vh]  flex justify-end items-center">
          <img src={demo} className="" />
        </div>
        <TextSlider />
      </div>
    </div>
  );
}

export default Signin;
