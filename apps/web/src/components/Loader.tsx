"use client";
import { fluidFont } from "../utils/fontSize";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  loading: boolean;
}

export default function Loader({ loading }: LoaderProps) {
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9990] flex items-center justify-center bg-[#77af9c]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div className="p-4 overflow-hidden">
            <motion.h1
              className="text-white Loader-font font-extrabold leading-none"
              style={fluidFont("4rem", "6vw", "10rem")}
              initial={{ y: 150 }}
              animate={{ y: 0 }}
              exit={{ y: -150 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              JANI
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
