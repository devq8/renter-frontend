import React, { useEffect, useState } from "react";
import NavBar from "../home/components/NavBar";
import Hero from "../home/components/Hero";
import About from "../home/components/About";
import Services from "../home/components/Services";
import CTA from "../home/components/CTA";
import Pricing from "../home/components/Pricing";
import Contact from "../home/components/Contact";
import Footer from "../home/components/Footer";
import "../../assets/css/style.css";
import AboutImage from "../../assets/images/kuwait-urban-map.jpeg";
import { Link } from "react-scroll";

function PrivacyPolicy() {
  return (
    <div>
      <NavBar />
      <Hero />
      <section
        className="relative md:py-24 py-16 bg-gray-50 dark:bg-slate-800"
        id="privacy-policy"
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
                  Renter Application
                </h6>
                <h3 className="mb-4 md:text-2xl text-xl font-medium dark:text-white">
                  Privacy Policy
                </h3>

                <h5>Introduction</h5>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  This Privacy Policy outlines how we collect, use, disclose,
                  and protect your information when you use our mobile
                  application ("App") and services.
                </p>
                <br />
                <h5>Information We Collect</h5>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  <b>Personal Information:</b> When you register, we may collect
                  personal details such as your name, email address, and phone
                  number.
                </p>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  <b>Payment Information:</b> For processing payments, we
                  collect necessary financial details.
                </p>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  <b>Usage Data:</b> We collect information on how you interact
                  with the app, including device information and log data.
                </p>
                <br />
                <h5>How We Use Your Information</h5>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  To provide and maintain our services
                </p>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  To notify you about changes to our services
                </p>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  To allow you to participate in interactive features
                </p>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  To provide customer support
                </p>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  To gather analysis to improve our services
                </p>
                <br />
                <h5>Sharing Your Information</h5>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  We do not share your personal information with third parties
                  except:
                </p>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  - When we have your consent
                </p>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  - For processing payments
                </p>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  - To comply with legal obligations
                </p>
                <br />
                <h5>Security</h5>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  We prioritize the security of your information and use
                  industry-standard measures to protect it. However, no method
                  of transmission over the internet or electronic storage is
                  100% secure.
                </p>
                <br />
                <h5>Your Rights</h5>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  You have the right to access, correct, or delete your personal
                  information. You can do this by contacting us at{" "}
                  <a href="mailto:info@wuc.com.kw">info@wuc.com.kw</a>.
                </p>
                <br />
                <h5>Changes to This Privacy Policy</h5>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page.
                </p>
                <br />
                <h5>Contact Us</h5>
                <p className="text-slate-400 text-sm dark:text-slate-300 max-w-2xl mx-auto">
                  If you have any questions or concerns about this Privacy
                  Policy, please contact us at the details below.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Contact />
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
