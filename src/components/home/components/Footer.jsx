import React from "react";
import { Link } from "react-router-dom";
import LogoLight from "../../../assets/images/logo-dark.png";

function Footer() {
  return (
    <footer className="py-8 bg-slate-800 dark:bg-gray-900">
      <div className="container">
        <div className="grid md:grid-cols-12 items-center">
          <div className="md:col-span-3">
            <Link to="#" className="logo-footer">
              <img
                src={LogoLight}
                className="md:ms-0 mx-auto w-[150px]"
                alt=""
              />
            </Link>
          </div>

          <div className="md:col-span-5 md:mt-0 mt-8">
            <div className="text-center">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Warba United Co. Designed &
                Developed with <i className="mdi mdi-heart text-tertiary"></i>{" "}
                in Kuwait 🇰🇼{" "}
                {/* <Link
                  to="https://shreethemes.in/"
                  target="_blank"
                  className="text-reset"
                >
                  Kuwait 🇰🇼
                </Link> */}
                .
              </p>
            </div>
          </div>

          <div className="md:col-span-4 md:mt-0 mt-8">
            <ul className="list-none foot-icon ltr:md:text-right rtl:md:text-left text-center">
              {/* <li className="inline ms-1"><Link to="https://1.envato.market/upwindt" target="_blank" className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-primary bg-slate-800 dark:bg-gray-900 hover:bg-primary dark:hover:bg-primary text-gray-400 hover:text-white"><i className="uil uil-shopping-cart align-middle" title="Buy Now"></i></Link></li> */}
              {/* <li className="inline ms-1">
                <Link
                  to="https://dribbble.com/shreethemes"
                  target="_blank"
                  className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-primary bg-slate-800 dark:bg-gray-900 hover:bg-primary dark:hover:bg-primary text-gray-400 hover:text-white"
                >
                  <i
                    className="uil uil-dribbble align-middle"
                    title="dribbble"
                  ></i>
                </Link>
              </li> */}
              {/* <li className="inline ms-1">
                <Link
                  to="https://www.behance.net/shreethemes"
                  target="_blank"
                  className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-primary bg-slate-800 dark:bg-gray-900 hover:bg-primary dark:hover:bg-primary text-gray-400 hover:text-white"
                >
                  <i className="uil uil-behance" title="Behance"></i>
                </Link>
              </li> */}
              {/* <li className="inline ms-1">
                <Link
                  to="http://linkedin.com/company/shreethemes"
                  target="_blank"
                  className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-primary bg-slate-800 dark:bg-gray-900 hover:bg-primary dark:hover:bg-primary text-gray-400 hover:text-white"
                >
                  <i className="uil uil-linkedin" title="Linkedin"></i>
                </Link>
              </li> */}
              <li className="inline ms-1">
                <Link
                  to="https://wa.me/96566600499"
                  target="_blank"
                  className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-primary bg-slate-800 dark:bg-gray-900 hover:bg-primary dark:hover:bg-primary text-gray-400 hover:text-white"
                >
                  <i
                    className="uil uil-whatsapp align-middle"
                    title="whatsapp"
                  ></i>
                </Link>
              </li>
              <li className="inline ms-1">
                <Link
                  to="https://www.instagram.com/wuc.com.kw/"
                  target="_blank"
                  className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-primary bg-slate-800 dark:bg-gray-900 hover:bg-primary dark:hover:bg-primary text-gray-400 hover:text-white"
                >
                  <i
                    className="uil uil-instagram align-middle"
                    title="instagram"
                  ></i>
                </Link>
              </li>
              {/* <li className="inline ms-1">
                <Link
                  to="https://twitter.com/shreethemes"
                  target="_blank"
                  className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-primary bg-slate-800 dark:bg-gray-900 hover:bg-primary dark:hover:bg-primary text-gray-400 hover:text-white"
                >
                  <i
                    className="uil uil-twitter align-middle"
                    title="twitter"
                  ></i>
                </Link>
              </li> */}
              <li className="inline ms-1">
                <Link
                  to="mailto:info@wuc.com.kw"
                  className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-primary bg-slate-800 dark:bg-gray-900 hover:bg-primary dark:hover:bg-primary text-gray-400 hover:text-white"
                >
                  <i
                    className="uil uil-envelope align-middle"
                    title="email"
                  ></i>
                </Link>
              </li>
              {/* <li className="inline ms-1"><Link to="https://forms.gle/QkTueCikDGqJnbky9" target="_blank" className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-primary bg-slate-800 dark:bg-gray-900 hover:bg-primary dark:hover:bg-primary text-gray-400 hover:text-white"><i className="uil uil-file align-middle" title="customization"></i></Link></li> */}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
