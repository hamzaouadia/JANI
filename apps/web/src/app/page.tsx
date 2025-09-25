"use client";
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Home from "./pages/Home";
import CustomCursor from '@/components/CustomCursor';
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import "./globals.css";
import { Manrope } from "next/font/google";
import Loader from "@/components/Loader";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "800"], // include 400 (regular)
  display: "swap",
});

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // simulate loading for 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative ${manrope.className}`}>
      <Loader loading={loading} />
      {!loading && (
        <>
          <NavBar />
          <Home />
          <Footer />
          <Chatbot />
          <CustomCursor />
        </>
      )}
    </div>
  );
}
