import React from "react";
import { Link } from "react-scroll";

function Pricing() {
  const packages = {
    pricing: [
      {
        id: 1,
        title: "Basic",
        price: 19,
        user: 5,
        features: [
          "Online Rent Collection",
          "Periodic Notifications Reminder",
          "Up to 10 Active Contracts",
          "1 Manager",
        ],
      },
      {
        id: 2,
        title: "Business",
        price: 99,
        user: 30,
        features: [
          "Online Rent Collection",
          "Periodic Notifications Reminder",
          "Up to 50 Active Contracts",
          "5 Manager & 10 Owner",
        ],
      },
      {
        id: 3,
        title: "Professional",
        price: 299,
        user: 100,
        features: [
          "Online Rent Collection",
          "Periodic Notifications Reminder",
          "Up to 100 Active Contracts",
          "10 Manager & 50 Owner",
        ],
      },
    ],
  };
  return (
    <section className="relative md:py-24 py-16" id="pricing">
      <div className="container">
        <div className="grid grid-cols-1 pb-8 text-center">
          <h6 className="text-primary text-base font-medium uppercase mb-2">
            Pricing
          </h6>
          <h3 className="mb-4 md:text-2xl text-xl font-medium dark:text-white">
            Comfortable Rates
          </h3>

          <p className="text-slate-400 dark:text-slate-300 max-w-xl mx-auto">
            Launch your campaign and benefit from our expertise on designing and
            managing conversion centered Tailwind CSS html page.
          </p>
        </div>

        <div className="flex flex-wrap">
          {packages.pricing.map((item, key) => (
            <div
              className="w-full md:w-1/2 lg:w-1/3 px-0 md:px-3 mt-8"
              key={key}
            >
              <div className="flex flex-col pt-8 pb-8 bg-zinc-50 hover:bg-white dark:bg-gray-800 dark:hover:bg-black rounded-md shadow shadow-slate-200 dark:shadow-slate-700 transition duration-500">
                <div className="px-8 pb-8">
                  <h3 className="mb-6 text-lg md:text-xl font-medium dark:text-white">
                    {item.title}
                  </h3>
                  <div className="flex items-end mb-6 dark:text-white/70">
                    <span className="relative -top-5 text-2xl">KD</span>
                    <span className="text-5xl font-semibold dark:text-white">
                      {item.price}
                    </span>
                    <span className="inline-block ms-1">/ month</span>
                  </div>
                  <p className="mb-6 text-slate-430 dark:text-slate-300">
                    Basic features for up to {item.user} users.
                  </p>
                  <Link
                    to="contact"
                    spy={true}
                    smooth={true}
                    duration={500}
                    style={{ cursor: "pointer" }}
                    className="btn bg-primary hover:bg-tertiary border-primary hover:border-tertiary text-white hover:text-black rounded-md w-full"
                  >
                    Join Now
                  </Link>
                </div>
                <div className="border-b border-slate-200 dark:border-slate-700"></div>
                <ul className="self-start px-8 pt-8">
                  {item.features.map((subitem, index) => (
                    <li
                      className="flex items-center my-1 text-slate-400 dark:text-slate-300"
                      key={index}
                    >
                      <i className="uil uil-check-circle text-lg text-green-600 me-1"></i>
                      <span>{subitem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center text-slate-400 dark:text-slate-300 mt-2">
          <span className="text-primary">*</span>No credit card required
        </div>
      </div>
    </section>
  );
}

export default Pricing;
