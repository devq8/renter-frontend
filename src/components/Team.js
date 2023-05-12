import React, { Component } from "react";

import { Link } from "react-router-dom";

import CountUp from 'react-countup';

import avatar1 from "../assets/images/client/01.jpg";
import avatar2 from "../assets/images/client/02.jpg";
import avatar3 from "../assets/images/client/03.jpg";
import avatar4 from "../assets/images/client/04.jpg";
import AmazonImage from '../assets/images/client/amazon.svg';
import GoogleImage from '../assets/images/client/google.svg';
import LenovoImage from '../assets/images/client/lenovo.svg';
import PaypalImage from '../assets/images/client/paypal.svg';
import ShopifyImage from '../assets/images/client/shopify.svg';
import SpotifyImage from '../assets/images/client/spotify.svg';

class Team extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team: [
                {
                    name: 'Calvin Carlo',
                    profile: avatar1,
                    designation: 'Designer',
                },
                {
                    name: 'Aliana Rosy',
                    profile: avatar2,
                    designation: 'Designer',
                },
                {
                    name: 'Sofia Razaq',
                    profile: avatar3,
                    designation: 'Designer',
                },
                {
                    name: 'Micheal Carlo',
                    profile: avatar4,
                    designation: 'Designer',
                }
            ]
        }
    }

    render() {
        return (
            <React.Fragment>
                <section className="relative md:py-24 py-16 bg-gray-50 dark:bg-slate-800" id="team">
                    <div className="container">
                        <div className="grid grid-cols-1 pb-8 text-center">
                            <h6 className="text-orange-600 text-base font-medium uppercase mb-2">Our Team</h6>
                            <h3 className="mb-4 md:text-2xl text-xl font-medium dark:text-white">Creative Minds</h3>

                            <p className="text-slate-400 dark:text-slate-300 max-w-xl mx-auto">Launch your campaign and benefit from our expertise on designing and managing conversion centered Tailwind CSS html page.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6 mt-8">
                            {this.state.team.map((member, index) => (

                                <div key={index} className="relative rounded-md shadow-lg overflow-hidden group">
                                    <img src={member.profile} className="group-hover:origin-center group-hover:scale-105 transition duration-500" alt="" />
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 z-0 transition duration-500"></div>
                                    <ul className="list-none absolute z-10 opacity-0 group-hover:opacity-100 top-4 end-4 mb-0 transition-all duration-500">
                                        <li className="mb-1"><Link to="#" className="btn bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white btn-icon btn-sm rounded-full"><i className="uil uil-facebook-f"></i></Link></li>
                                        <li className="mb-1"><Link to="#" className="btn bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white btn-icon btn-sm rounded-full"><i className="uil uil-instagram"></i></Link></li>
                                        <li className="mb-1"><Link to="#" className="btn bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white btn-icon btn-sm rounded-full"><i className="uil uil-twitter"></i></Link></li>
                                    </ul>

                                    <div className="content absolute start-4 end-4 bottom-4 bg-white dark:bg-slate-900 opacity-0 group-hover:opacity-100 p-4 rounded-md text-center transition-all duration-500">
                                        <Link to="#" className="h5 text-md dark:text-white hover:text-orange-600 dark:hover:text-orange-600 font-medium">{member.name}</Link>
                                        <h6 className="text-slate-400 dark:text-slate-300 mb-0 font-light">{member.designation}</h6>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="container mt-12">
                        <div className="grid grid-cols-2 md:grid-cols-4">
                            <div className="counter-box position-relative text-center">
                                <h3 className="font-medium text-3xl mb-2 dark:text-white">
                                    <CountUp
                                        start={3}
                                        className="counter-value"
                                        end={40}
                                        duration={2.75} />+</h3>
                                <span className="counter-head text-slate-400 dark:text-slate-300">Projects</span>
                            </div>

                            <div className="counter-box position-relative text-center">
                                <h3 className="font-medium text-3xl mb-2 dark:text-white">
                                    <CountUp
                                        start={1}
                                        className="counter-value"
                                        end={200}
                                        duration={2.75} />+</h3>
                                <span className="counter-head text-slate-400 dark:text-slate-300">Clients</span>
                            </div>

                            <div className="counter-box position-relative text-center">
                                <h3 className="font-medium text-3xl mb-2 dark:text-white">
                                    <CountUp
                                        start={200}
                                        className="counter-value"
                                        end={457}
                                        duration={2.75} />
                                    K</h3>
                                <span className="counter-head text-slate-400 dark:text-slate-300">Members</span>
                            </div>

                            <div className="counter-box position-relative text-center">
                                <h3 className="font-medium text-3xl mb-2 dark:text-white">
                                    <CountUp
                                        start={100}
                                        className="counter-value"
                                        end={150}
                                        duration={2.75} />
                                    +</h3>
                                <span className="counter-head text-slate-400 dark:text-slate-300">Employee</span>
                            </div>
                        </div>
                    </div>

                    <div className="container mt-12">
                        <div className="grid md:grid-cols-6 grid-cols-2 justify-center gap-8">
                            <div className="mx-auto">
                                <img src={AmazonImage} className="h-[25px]" alt="" />
                            </div>

                            <div className="mx-auto">
                                <img src={GoogleImage} className="h-[25px]" alt="" />
                            </div>

                            <div className="mx-auto">
                                <img src={LenovoImage} className="h-[25px]" alt="" />
                            </div>

                            <div className="mx-auto">
                                <img src={PaypalImage} className="h-[25px]" alt="" />
                            </div>

                            <div className="mx-auto">
                                <img src={ShopifyImage} className="h-[25px]" alt="" />
                            </div>

                            <div className="mx-auto">
                                <img src={SpotifyImage} className="h-[25px]" alt="" />
                            </div>
                        </div>
                    </div>
                    {/* <!--end container--> */}
                </section>
            </React.Fragment>
        )
    }
}

export default Team;

