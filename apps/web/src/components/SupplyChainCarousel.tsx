"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fluidFont } from "../utils/fontSize";


const items = [
  { title: "Tea", desc: "High-quality tea leaves sourced from sustainable farms, ensuring freshness and authentic flavor.", url: "/images/Tea.jpeg" },
  { title: "Coffee", desc: "Premium coffee beans tracked from farm to cup, guaranteeing rich aroma and ethical sourcing.", url: "/images/Coffee.jpeg" },
  { title: "Milk", desc: "Fresh milk produced from healthy dairy farms with full traceability for safety and quality.", url: "/images/Milk.jpeg" },
  { title: "Honey", desc: "Pure honey harvested responsibly from beekeepers, maintaining natural taste and nutritional value.", url: "/images/Honey.jpeg" },
  { title: "Spices", desc: "Aromatic spices sourced globally, ensuring authentic flavor and verified origin for every batch.", url: "/images/Spices.jpeg" },
  { title: "Wine", desc: "Finest wines traced from vineyard to bottle, highlighting craftsmanship and origin.", url: "/images/Wine.jpeg" },
  { title: "Cheese", desc: "Artisan cheeses with transparent sourcing, preserving traditional recipes and quality.", url: "/images/Cheese.jpeg" },
  { title: "Chocolate", desc: "Premium chocolate made from traceable cocoa beans, supporting ethical farming practices.", url: "/images/Chocolate.jpeg" },
  { title: "Olive Oil", desc: "Extra virgin olive oil carefully pressed from verified groves, ensuring purity and taste.", url: "/images/OliveOil.jpeg" },
];


export default function InfiniteCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Example breakpoint for mobile
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3000);
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="relative w-full h-screen flex flex-row lg:flex-col items-center justify-center z-30">
      
      <div className="absolute top-0 left-0 w-full h-full flex items-end justify-center bg-gray-800">
          <Image
            src={items[currentIndex].url}
            alt=""
            fill
            className="object-cover"
          />
          <div
            className="w-1/2 lg:p-6 p-4 cursor-pointer z-50"
          >
            <div className="cursor-pointer w-full z-30">
              <div className="flex flex-row justify-center items-center">
                {items.map((_item, index) => {
                  const width = !isMobile ? Math.max(4, 400 / items.length) : 250 / items.length; // Minimum width for mobile
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                        startInterval();
                      }}
                      className="flex flex-col justify-around items-center lg:p-2 p-1.5"
                    >
                      <div
                        className={`h-1 rounded-full cursor-pointer z-10 transition-all duration-800 ${
                          index === currentIndex ? "bg-white" : "bg-white opacity-40"
                        }`}
                        style={{ width: `${width}px` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
      </div>
      <div className="relative pt-20 lg:pt-10 w-full lg:w-screen h-full flex lg:flex-row flex-col items-center justify-between p-4 backdrop-blur-sm z-40">
      {/* Left Section - Text */}
      <div className="lg:w-1/2 h-full flex justify-center items-center p-4 lg:p-8">
        <div className="h-full w-full flex flex-col justify-center lg:items-start text-center lg:text-left">
          <AnimatePresence mode="wait">
            <motion.h1
              key={items[currentIndex].title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="custom-font font-bold break-words lg:mb-4"
              style={fluidFont("4rem", "6vw", "8rem")}
            >
              {items[currentIndex].title}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={items[currentIndex].desc}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="custom-font font-light text-lg lg:text-start"
              style={fluidFont("1rem", "1.5vw", "2rem")}
            >
              {items[currentIndex].desc}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="lg:w-1/2 h-full w-full p-2 pb-8 lg:p-8 lg:pr-20 flex lg:justify-end justify-between items-center">
        {/* <AnimatePresence mode="wait"> */}
          <div
            key={items[currentIndex].url}
            className="relative w-[30rem] h-[38rem] max-w-full rounded-2xl border-2 border-[#77af9c] overflow-hidden"
          >
            <Image
              src={items[currentIndex].url}
              alt={items[currentIndex].title || "Image"}
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>
        {/* </AnimatePresence> */}
      </div>
    </div>
    </section>
  );
}
