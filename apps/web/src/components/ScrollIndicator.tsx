"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function ScrollIndicator() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: hidden ? 0 : 0.4 }}
      transition={{ 
        duration: 0.6, 
        ease: "easeInOut", 
        delay: hidden ? 0 : 1.2 // only delays on the first mount
      }}
      className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-center w-10 h-10 flex flex-col items-center justify-center"
    >
      {/* Label (desktop only) */}
      <div className="w-full h-full flex flex-col items-center justify-center text-black opacity-0 lg:opacity-100 whitespace-nowrap text-sm">
        <p>Scroll Down</p>
      </div>

      {/* Bouncing icon */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6 text-black" />
      </motion.div>
    </motion.div>
  );
}
