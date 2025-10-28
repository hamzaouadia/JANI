"use client";
import { motion } from "framer-motion";
import { ReactNode, useState } from "react";


const textItem = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { delay: 0.8, duration: 0.5 } },
};



type NeumorphicEffectProps = {
  children: ReactNode;
  className?: string;
  pressEffect?: boolean; // <-- new flag
};

export default function NeumorphicEffect({
  children,
  className = "",
  pressEffect = false,
}: NeumorphicEffectProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.div
      className={`${className} select-none`}
      initial={{
        backgroundColor: "#bg-[#d7fff1]",
        boxShadow:
          "0px 0px 0px rgba(0,0,0,0.4), 0px 0px 0px rgba(216,243,220,0.2)",
      }}
      animate={{
        boxShadow:
          pressEffect && isPressed
            ? "inset 3px 2px 5px rgba(0,0,0,0.4), inset -2px -2px 5px rgba(216,243,220,0.2)"
            : "3px 2px 5px rgba(0,0,0,0.4), -2px -2px 5px rgba(216,243,220,0.2)",
      }}
      exit={{ boxShadow: "0px 0px 0px rgba(0,0,0,0.4), 0px 0px 0px rgba(216,243,220,0.2)"}}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onMouseDown={() => pressEffect && setIsPressed(true)}
      onMouseUp={() => pressEffect && setIsPressed(false)}
      onMouseLeave={() => pressEffect && setIsPressed(false)}
      onTouchStart={() => pressEffect && setIsPressed(true)}
      onTouchEnd={() => pressEffect && setIsPressed(false)}
    >
      <motion.div
        variants={textItem}
        initial="hidden"
        animate="show"
        exit="hidden"
      >
        <>{children}</>
      </motion.div>
    </motion.div>
  );
}
