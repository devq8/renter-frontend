import React from "react";
import CTABackground from "../../../assets/images/banner.png";
import { Link } from "react-scroll";

function CTA() {
  return (
    <section
      style={{ backgroundImage: `url(${CTABackground})` }}
      className="py-24 w-full table relative bg-center bg-cover"
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="container relative">
        <div className="grid grid-cols-1 pb-8 text-center">
          <h3 className="mb-6 md:text-3xl text-2xl text-white font-medium">
            Ready to manage all your properties in one place?
          </h3>

          <p className="text-white text-base opacity-80 max-w-xl mx-auto">
            Say goodbye to late rent payments and hello to hassle-free property
            management with our efficient rent collection services!
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
              Join Us Now!
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
