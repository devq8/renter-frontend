import React, { Component } from "react";
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';
import { Link } from 'react-router-dom';

import Image1 from "../assets/images/portfolio/1.jpg";
import Image2 from "../assets/images/portfolio/2.jpg";
import Image3 from "../assets/images/portfolio/3.jpg";
import Image4 from "../assets/images/portfolio/4.jpg";
import Image5 from "../assets/images/portfolio/5.jpg";
import Image6 from "../assets/images/portfolio/6.jpg";
import Image7 from "../assets/images/portfolio/7.jpg";
import Image8 from "../assets/images/portfolio/8.jpg";

import CTABackground from "../assets/images/bg/cta.png";

const images = [
    Image1,
    Image2,
    Image3,
    Image4,
    Image5,
    Image6,
    Image7,
    Image8
];

/**
 * Portfolio section
 */
class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectList: [
                {

                    image: Image1,
                    title: 'Mockup Collection',
                    subtext: 'Branding'
                },
                {
                    image: Image2,
                    title: 'Mockup Collection',
                    subtext: 'Designing'
                }, {
                    image: Image3,
                    title: 'Abstract images',
                    subtext: 'Abstract'
                }, {
                    image: Image4,
                    title: 'Yellow bg with Books',
                    subtext: 'Books'
                }, {
                    image: Image5,
                    title: 'Company V-card',
                    subtext: 'V-card'
                }, {
                    image: Image6,
                    title: 'Mockup box with paints',
                    subtext: 'Photography'
                },
                {
                    image: Image7,
                    title: 'Coffee cup',
                    subtext: 'Cups'
                },
                {
                    image: Image8,
                    title: 'Pen and article',
                    subtext: 'Article'
                }
            ],
            isOpenMenu: true,
            photoIndex: 0,
        };
    }

    render() {
        const { photoIndex, isOpen } = this.state;
        return (
            <React.Fragment>
                {/* Project Start  */}
                <section className="relative md:py-24 py-16 bg-gray-50 dark:bg-slate-800 active" id="portfolio">
                    <div className="container">
                        <div className="grid grid-cols-1 pb-8 text-center">
                            <h6 className="text-orange-600 text-base font-medium uppercase mb-2">Portfolio</h6>
                            <h3 className="mb-4 md:text-2xl text-xl font-medium dark:text-white">Our Works &amp; Projects</h3>

                            <p className="text-slate-400 dark:text-slate-300 max-w-xl mx-auto">Launch your campaign and benefit from our expertise on designing and managing conversion centered Tailwind CSS html page.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6 mt-8">
                            {this.state.projectList.map((item, index) => (
                                <div className="relative rounded-md shadow-sm overflow-hidden group" key={index}>
                                    <img src={item.image} className="group-hover:origin-center group-hover:scale-110 group-hover:rotate-3 transition duration-500" alt="workimage" />
                                    <div className="absolute inset-0 group-hover:bg-black opacity-50 transition duration-500 z-0"></div>

                                    <div className="content">
                                        <div className="icon absolute z-10 opacity-0 group-hover:opacity-100 top-4 end-4 transition-all duration-500">
                                            <Link to="#" onClick={() => this.setState({ isOpen: true, photoIndex: index })} className="btn bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white btn-icon rounded-full lightbox">
                                                <i className="uil uil-camera"></i></Link>
                                        </div>
                                        <div className="absolute z-10 opacity-0 group-hover:opacity-100 bottom-4 start-4 transition-all duration-500">
                                            <Link to="#" className="h6 text-md font-medium text-white hover:text-orange-600 transition duration-500">{item.title}</Link>
                                            <p className="text-slate-100 tag mb-0">{item.subtext}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {isOpen && (
                            <Lightbox
                                mainSrc={images[photoIndex]}
                                nextSrc={images[(photoIndex + 1) % images.length]}
                                prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                                onCloseRequest={() => this.setState({ isOpen: false })}
                                onMovePrevRequest={() =>
                                    this.setState({
                                        photoIndex: (photoIndex + images.length - 1) % images.length,
                                    })
                                }
                                onMoveNextRequest={() =>
                                    this.setState({
                                        photoIndex: (photoIndex + 1) % images.length,
                                    })
                                }
                            />
                        )}
                    </div>
                </section>
                {/* Project End  */}
                <section
                    style={{ backgroundImage: `url(${CTABackground})` }}
                    className="py-24 w-full table relative bg-center bg-cover">
                    <div className="absolute inset-0 bg-black opacity-80"></div>
                    <div className="container relative">
                        <div className="grid grid-cols-1 pb-8 text-center">
                            <h3 className="mb-6 md:text-3xl text-2xl text-white font-medium">Ready to start your next web project now?</h3>

                            <p className="text-white opacity-50 max-w-xl mx-auto">Launch your campaign and benefit from our expertise on designing and managing conversion centered Tailwind CSS html page.</p>

                            <div className="relative mt-10">
                                <Link to="#" className="btn bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white rounded-md">Get Started !</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}
export default Portfolio;