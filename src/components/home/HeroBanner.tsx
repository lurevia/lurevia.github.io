import React, { useState, useEffect } from "react";
import { HeroDesktop } from "./desktop/HeroDesktop";
import { HeroMobile } from "./mobile/HeroMobile";
import { SLIDES } from "../../bin/utils/constant/constant";


export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <HeroMobile 
        currentSlide={currentSlide} 
        setCurrentSlide={setCurrentSlide} 
      />
      <HeroDesktop />
    </>
  );
};
