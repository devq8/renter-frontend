import React, { useState } from "react";
import style from "./ScrollTop.module.scss";
import ChevronUp from "../../assets/icons/chevron-up.svg";

const SCROLL_BREAKPOINT = 500;

function ScrollTop() {
  const [isVisible, setIsVisible] = useState(false);
  function scrollHandler() {
    if (window.scrollY > SCROLL_BREAKPOINT && !isVisible) {
      setIsVisible(true);
    } else if (window.scrollY < SCROLL_BREAKPOINT && isVisible) {
      setIsVisible(false);
    }
  }
  const scrollToTop = () => window.scrollTo(0, 0);
  window.addEventListener("scroll", scrollHandler);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="hide-on-print">
      <div className={style.scrollTop} onClick={scrollToTop}>
        <img className={style.icon} alt="arrow-up" src={ChevronUp} />
      </div>
    </div>
  );
}

export default ScrollTop;
