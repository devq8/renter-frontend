import React, { Component } from "react";
import { Link } from "react-router-dom";

import LogoLight from "../assets/images/logo-light.png";

class Footer extends Component {
  
    render() {
        return (
            <React.Fragment>
                {/*  Start Footer  */}
                <footer className="py-8 bg-slate-800 dark:bg-gray-900">
                    <div className="container">
                        <div className="grid md:grid-cols-12 items-center">
                            <div className="md:col-span-3">
                                <Link to="#" className="logo-footer">
                                    <img src={LogoLight} className="md:ms-0 mx-auto" alt="" />
                                </Link>
                            </div>

                            <div className="md:col-span-5 md:mt-0 mt-8">
                                <div className="text-center">
                                    <p className="text-gray-400">© {(new Date().getFullYear())}{" "} Upwind. Design & Develop with <i className="mdi mdi-heart text-orange-700"></i> by <Link to="https://shreethemes.in/" target="_blank" className="text-reset">Shreethemes</Link>.</p>
                                </div>
                            </div>

                            <div className="md:col-span-4 md:mt-0 mt-8">
                                <ul className="list-none foot-icon ltr:md:text-right rtl:md:text-left text-center">
                                    {/* <li className="inline ms-1"><Link to="https://1.envato.market/upwindt" target="_blank" className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-orange-600 bg-slate-800 dark:bg-gray-900 hover:bg-orange-600 dark:hover:bg-orange-600 text-gray-400 hover:text-white"><i className="uil uil-shopping-cart align-middle" title="Buy Now"></i></Link></li> */}
                                    <li className="inline ms-1"><Link to="https://dribbble.com/shreethemes" target="_blank" className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-orange-600 bg-slate-800 dark:bg-gray-900 hover:bg-orange-600 dark:hover:bg-orange-600 text-gray-400 hover:text-white"><i className="uil uil-dribbble align-middle" title="dribbble"></i></Link></li>
                                    <li className="inline ms-1"><Link to="https://www.behance.net/shreethemes" target="_blank" className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-orange-600 bg-slate-800 dark:bg-gray-900 hover:bg-orange-600 dark:hover:bg-orange-600 text-gray-400 hover:text-white"><i className="uil uil-behance" title="Behance"></i></Link></li>
                                    <li className="inline ms-1"><Link to="http://linkedin.com/company/shreethemes" target="_blank" className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-orange-600 bg-slate-800 dark:bg-gray-900 hover:bg-orange-600 dark:hover:bg-orange-600 text-gray-400 hover:text-white"><i className="uil uil-linkedin" title="Linkedin"></i></Link></li>
                                    <li className="inline ms-1"><Link to="https://www.facebook.com/shreethemes" target="_blank" className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-orange-600 bg-slate-800 dark:bg-gray-900 hover:bg-orange-600 dark:hover:bg-orange-600 text-gray-400 hover:text-white"><i className="uil uil-facebook-f align-middle" title="facebook"></i></Link></li>
                                    <li className="inline ms-1"><Link to="https://www.instagram.com/shreethemes/" target="_blank" className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-orange-600 bg-slate-800 dark:bg-gray-900 hover:bg-orange-600 dark:hover:bg-orange-600 text-gray-400 hover:text-white"><i className="uil uil-instagram align-middle" title="instagram"></i></Link></li>
                                    <li className="inline ms-1"><Link to="https://twitter.com/shreethemes" target="_blank" className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-orange-600 bg-slate-800 dark:bg-gray-900 hover:bg-orange-600 dark:hover:bg-orange-600 text-gray-400 hover:text-white"><i className="uil uil-twitter align-middle" title="twitter"></i></Link></li>
                                    {/* <li className="inline ms-1"><Link to="mailto:support@shreethemes.in" className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-orange-600 bg-slate-800 dark:bg-gray-900 hover:bg-orange-600 dark:hover:bg-orange-600 text-gray-400 hover:text-white"><i className="uil uil-envelope align-middle" title="email"></i></Link></li> */}
                                    {/* <li className="inline ms-1"><Link to="https://forms.gle/QkTueCikDGqJnbky9" target="_blank" className="btn btn-icon btn-sm border rounded-md border-slate-700 dark:border-slate-800 hover:border-orange-600 bg-slate-800 dark:bg-gray-900 hover:bg-orange-600 dark:hover:bg-orange-600 text-gray-400 hover:text-white"><i className="uil uil-file align-middle" title="customization"></i></Link></li> */}
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer>
                {/* <!-- End Footer --> */}

                {/* <!-- Back to top --> */}
                <Link to="home" id="back-to-top" className="back-to-top fixed hidden text-lg rounded-full z-10 bottom-5 end-5 h-9 w-9 text-center bg-orange-600 text-white leading-9"><i className="uil uil-arrow-up"></i></Link>
                {/* <!-- Back to top --> */}
            </React.Fragment>
        );
    }
}

export default Footer;
