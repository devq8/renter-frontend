import React, { useEffect, useState } from "react";
import LogoDark from "../../../assets/images/logo-dark.png";
import LogoLight from "../../../assets/images/logo.png";
import { Link } from "react-scroll";
import { useNavigate } from "react-router";
import { useUser } from "../../../utils/auth";

function NavBar() {
  const navigate = useNavigate();
  const user = useUser();
  const [isOpenMenu, setIsOpenMenu] = useState(true);
  const toggleClass = isOpenMenu ? "hidden" : "";
  function toggleMenu() {
    setIsOpenMenu(!isOpenMenu);
  }

  const [isSticky, setIsSticky] = useState(false);

  function handleScroll() {
    if (
      document.body.scrollTop >= 500 ||
      document.documentElement.scrollTop >= 500
    ) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navbarClass = isSticky ? "navbar is-sticky" : "navbar";

  function handleClick() {
    setIsOpenMenu(!isOpenMenu);
  }

  function handleNavigation(e) {
    if (e.target.name === "signin") {
      navigate(`/signin`);
    } else if (e.target.name === "signup") {
      navigate(`/signup`);
    } else if (e.target.name === "dashboard") {
      navigate(`/dashboard`);
    }
  }

  return (
    <nav className={navbarClass} id="navbar">
      <div className="container flex flex-wrap items-center justify-center">
        <a className="navbar-brand" href="#">
          <span className="inline-block dark:hidden">
            <img src={LogoLight} className="l-dark w-[200px]" alt="" />
            <img src={LogoDark} className="l-light w-[200px]" alt="" />
          </span>
          <img src={LogoDark} className="hidden dark:inline-block" alt="" />
        </a>

        <div className="nav-icons flex items-center justify-center lg_992:order-2 ms-auto">
          {/* Social Media Items */}
          <ul className="list-none menu-social mb-0">
            {/* <li className="inline ms-1">
              <Link2 to="#">
                <span className="login-btn-primary">
                  <span className="btn btn-sm btn-icon rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white">
                    <i className="uil uil-github"></i>
                  </span>
                </span>
                <span className="login-btn-light">
                  <span className="btn btn-sm btn-icon rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-slate-900 dark:hover:bg-gray-700 hover:border-gray-100 dark:border-gray-700 dark:hover:border-gray-700">
                    <i className="uil uil-github"></i>
                  </span>
                </span>
              </Link2>
            </li>
            <li className="inline ms-1">
              <Link2 to="#">
                <span className="login-btn-primary">
                  <span className="btn btn-sm btn-icon rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white">
                    <i className="uil uil-twitter"></i>
                  </span>
                </span>
                <span className="login-btn-light">
                  <span className="btn btn-sm btn-icon rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-slate-900 dark:hover:bg-gray-700 hover:border-gray-100 dark:border-gray-700 dark:hover:border-gray-700">
                    <i className="uil uil-twitter"></i>
                  </span>
                </span>
              </Link2>
            </li>
            <li className="inline ms-1">
              <Link2 to="#">
                <span className="login-btn-primary">
                  <span className="btn btn-sm btn-icon rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white">
                    <i className="uil uil-instagram"></i>
                  </span>
                </span>
                <span className="login-btn-light">
                  <span className="btn btn-sm btn-icon rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-slate-900 dark:hover:bg-gray-700 hover:border-gray-100 dark:border-gray-700 dark:hover:border-gray-700">
                    <i className="uil uil-instagram"></i>
                  </span>
                </span>
              </Link2>
            </li> */}
          </ul>
          <div className="hidden lg_992:block space-x-4">
            {!user?.data ? (
              <>
                <button
                  name="signin"
                  onClick={handleNavigation}
                  className="btn bg-transparent hover:bg-tertiary border-primary hover:border-tertiary text-primary hover:text-black rounded-md"
                >
                  Sign In
                </button>
                <button
                  name="signup"
                  onClick={handleNavigation}
                  className="btn bg-primary hover:bg-tertiary border-primary hover:border-tertiary text-white hover:text-black rounded-md"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                name="dashboard"
                onClick={handleNavigation}
                className="btn bg-primary hover:bg-tertiary border-primary hover:border-tertiary text-white hover:text-black rounded-md"
              >
                Dashboard
              </button>
            )}
          </div>

          <button
            type="button"
            className="collapse-btn inline-flex items-center ms-3 text-dark dark:text-white lg_992:hidden"
            onTouchStart={toggleMenu}
          >
            <span className="sr-only">Navigation Menu</span>
            <i className="mdi mdi-menu mdi-24px"></i>
          </button>
        </div>

        <div
          className={`
          ${toggleClass} 
          navigation lg_992:order-1 lg_992:flex`}
          id="menu-collapse"
        >
          {/* NavBar Items */}
          <ul className="navbar-nav nav-light" id="navbar-navlist">
            <Link
              className="nav-item"
              to="home"
              activeclassname="active"
              spy={true}
              smooth={true}
              duration={500}
              onClick={handleClick}
            >
              <span className="nav-link">Home</span>
            </Link>
            <Link
              className="nav-item"
              activeclassname="active"
              spy={true}
              smooth={true}
              duration={500}
              onClick={handleClick}
              to="about"
            >
              <span className="nav-link">About us</span>
            </Link>
            <Link
              className="nav-item"
              to="features"
              activeclassname="active"
              spy={true}
              smooth={true}
              duration={500}
              onClick={handleClick}
            >
              <span className="nav-link">Services</span>
            </Link>
            <Link
              className="nav-item"
              to="pricing"
              activeclassname="active"
              spy={true}
              smooth={true}
              duration={500}
              onClick={handleClick}
            >
              <span className="nav-link">Pricing</span>
            </Link>
            <Link
              className="nav-item"
              to="contact"
              activeclassname="active"
              spy={true}
              smooth={true}
              duration={500}
              onClick={handleClick}
            >
              <span className="nav-link">Contact us</span>
            </Link>
            <div className="lg_992:hidden flex flex-row items-center justify-center">
              {!user?.data ? (
                <>
                  <button
                    name="signup"
                    onClick={handleNavigation}
                    className="btn m-2 w-[50%] bg-primary hover:bg-tertiary border-primary hover:border-tertiary text-white hover:text-black rounded-md"
                  >
                    Sign Up
                  </button>
                  <button
                    name="signin"
                    onClick={handleNavigation}
                    className="btn m-2 w-[50%] bg-transparent hover:bg-tertiary border-primary hover:border-tertiary text-primary hover:text-black rounded-md"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <button
                  name="dashboard"
                  onClick={handleNavigation}
                  className="btn bg-primary hover:bg-tertiary border-primary hover:border-tertiary text-white hover:text-black rounded-md"
                >
                  Dashboard
                </button>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
