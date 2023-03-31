import React from "react";
import "./Signin.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function TextSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };
  return (
    <div className="h-[20vh]  mx-16">
      <Slider {...settings}>
        <div className="my-3 ">
          <h2 className="text-2xl font-bold text-start">Automated System</h2>
          <p className="text-lg text-start">
            No one likes repeating themselves. Especially when it comes to
            money. That’s why our automated rental collection system sends
            payment reminders to your tenants – so you don’t have to. Simply
            schedule your payment requests and we’ll handle the chasing.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-start">Notifications</h2>
          <p className="text-lg text-start">
            No one likes repeating themselves. Especially when it comes to
            money. That’s why our automated rental collection system sends
            payment reminders to your tenants – so you don’t have to. Simply
            schedule your payment requests and we’ll handle the chasing.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-start">
            All Properties in One Location
          </h2>
          <p className="text-lg text-start">
            No one likes repeating themselves. Especially when it comes to
            money. That’s why our automated rental collection system sends
            payment reminders to your tenants – so you don’t have to. Simply
            schedule your payment requests and we’ll handle the chasing.
          </p>
        </div>
      </Slider>
    </div>
  );
}

export default TextSlider;
