"use client";

import NavBar from "../components/NavBar";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
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
export default function Page() {
  return (
    <div className={`relative ${manrope.className}`}>
      <CustomCursor />
      <NavBar />
      <main className="relative w-full">
        <HeroSection />
        <SupplyChainSection />
        <SupplyChainCarousel />
        <BusinessSection />
        <TeamSection />
        <ScrollBarIndicator />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}