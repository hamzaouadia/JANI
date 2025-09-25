"use client";

// import { useEffect, useRef, useState } from "react";
// import { AnimatePresence } from "framer-motion";

import HeroSection from "@/components/HeroSection";
import SupplyChainSection from "@/components/SupplyChainSection";
import BusinessSection from "@/components/BusinessSection";
import SupplyChainCarousel from "@/components/SupplyChainCarousel";
import TeamSection from "@/components/TeamSection";

const Home = () => {
 
  return (
    <div
      className="relative w-full"
    >
      <HeroSection />
      <SupplyChainSection />
      <SupplyChainCarousel />
      <BusinessSection />
      <TeamSection />

    </div>
  );
};

export default Home;
