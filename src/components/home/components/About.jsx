import React from "react";
import AboutImage from "../../../assets/images/kuwait-urban-map.jpeg";
import { Link as Link2 } from "react-router-dom";
import { Link } from "react-scroll";

function About() {
  return (
    <section
      className="relative md:py-24 py-16 bg-gray-50 dark:bg-slate-800"
      id="about"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 md:grid-cols-2 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="relative">
              <img
                src={AboutImage}
                className="rounded-lg shadow-lg relative w-[600px] "
                alt=""
              />
              <div className="absolute bottom-2/4 translate-y-2/4 start-0 end-0 text-center">
                {/* <Link2
                  to="#"
                  //   onClick={this.openModal}
                  className="lightbox h-20 w-20 rounded-full shadow-lg shadow-slate-100 dark:shadow-slate-800 inline-flex items-center justify-center bg-white dark:bg-slate-900 text-orange-600"
                >
                  <i className="mdi mdi-play inline-flex items-center justify-center text-2xl"></i>
                </Link2> */}
              </div>
            </div>
          </div>
          {/* end col */}

          <div className="lg:col-span-7">
            <div className="lg:ms-7">
              <h6 className="text-primary text-base font-medium uppercase mb-2">
                Who We Are ?
              </h6>
              <h3 className="mb-4 md:text-2xl text-xl font-medium dark:text-white">
                Our Company Story
              </h3>

              <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                Our company story began with a manual rent collection process
                that was fraught with issues. From collecting fake money to
                human error in depositing cash to the bank, we faced numerous
                risks and challenges. We spent countless hours preparing monthly
                and annual reports, which were often inaccessible to owners and
                managers until we mailed them out. Despite these obstacles, we
                successfully collected over 1 million dollars in cash and gained
                16+ years of experience in dealing with hard tenants. With a
                skilled maintenance team and top-notch legal representation, we
                are committed to providing our clients with a smarter, more
                efficient way to manage their properties.
              </p>

              <div className="relative mt-10">
                <Link
                  to="contact"
                  spy={true}
                  smooth={true}
                  duration={500}
                  className="btn bg-primary hover:bg-tertiary border-primary hover:border-tertiary text-white hover:text-black rounded-md"
                  style={{ cursor: "pointer" }}

                  // className="btn bg-primary hover:bg-tertiary border-primary hover:border-tertiary text-white hover:text-black rounded-md"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
