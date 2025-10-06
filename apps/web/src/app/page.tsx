"use client";

import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import Loader from "@/components/Loader";
import "./globals.css";
import { Manrope } from "next/font/google";
import HeroSection from "@/components/HeroSection";
import SupplyChainSection from "@/components/SupplyChainSection";
import BusinessSection from "@/components/BusinessSection";
import SupplyChainCarousel from "@/components/SupplyChainCarousel";
import TeamSection from "@/components/TeamSection";
import ScrollBarIndicator from "@/components/ScrollBarIndicator";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "800"],
  display: "swap",
});

const LOADING_DURATION_MS = 3000;

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsLoading(false), LOADING_DURATION_MS);
    return () => clearTimeout(timeoutId);
  }, []);
  

  return (
    <div className={`relative ${manrope.className}`}>
      <Loader loading={isLoading} />
      {!isLoading && (
        <>
          <CustomCursor />
          <NavBar />
          <main
            className="relative w-full"
          >
            <HeroSection />
            <SupplyChainSection />
            <SupplyChainCarousel />
            <BusinessSection />
            <TeamSection />
            <ScrollBarIndicator />
          </main>
          <Footer />
          <Chatbot />
        </>
      )}
    </div>
  );
}