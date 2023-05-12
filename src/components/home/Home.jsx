import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import CTA from "./components/CTA";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "../../assets/css/style.css";

function Home() {
  return (
    <div>
      <NavBar />
      <Hero />
      <About />
      <Services />
      <CTA />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;
