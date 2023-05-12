import React, { useEffect, useRef } from "react";
import BackgroundImage from "../../../assets/images/banner.png";
import { Link as Link2 } from "react-router-dom";
import { Link } from "react-scroll";
import Typed from "typed.js";
import "./style.css";

function Hero() {
  const el = useRef(null);

  useEffect(() => {
    const options = {
      strings: [
        "<i>Property Owners</i>",
        "<i>Property Management Agencies</i>",
        "<i>Real Estate Companies</i>",
      ],
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 2000,
      loop: true,
      startDelay: 300,
      // showCursor: true,
      // cursorChar: "_",
      cursorStyle: "display: inline!important",
    };

    const typed = new Typed(el.current, options);

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <section
      style={{ backgroundImage: `url(${BackgroundImage})` }}
      className="py-36 lg:py-64 w-full table relative bg-center bg-cover h-[100vh]"
      id="home"
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="container relative">
        <div className="grid grid-cols-1 mt-12">
          <h4 className="text-white lg:text-5xl text-4xl lg:leading-normal leading-normal font-medium mb-7 position-relative">
            Provide a Smart Rental Collection System <br />
            for{" "}
            <span
              ref={el}
              style={{ display: "inline-block" }}
              className="typewrite relative text-type-element text-primary"
            />
            {/* <span
              className="typewrite relative text-type-element"
              id="typed"
              ref={el}
              // data-period="2000"
              // data-type='[ "Business", "Startups", "Digital Agency", "Marketing" ]'
            ></span> */}
          </h4>

          <p className="text-white opacity-70 mb-0 max-w-2xl text-lg">
            Looking to efficiently manage and rent out your properties? Our
            intelligent system can help! Say goodbye to the hassle and welcome a
            seamless experience with our smart solution.
          </p>

          <div className="relative mt-10">
            <Link
              to="contact"
              spy={true}
              smooth={true}
              duration={500}
              style={{ cursor: "pointer" }}
              className="btn bg-primary hover:bg-tertiary border-primary hover:border-tertiary text-white hover:text-black rounded-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
