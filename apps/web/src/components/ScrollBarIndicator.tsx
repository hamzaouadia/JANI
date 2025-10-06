"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform, type MotionValue } from "framer-motion";

const SEGMENTS = 100;

type ScrollSegmentProps = {
  index: number;
  springPercent: MotionValue<number>;
};

const ScrollSegment = ({ index, springPercent }: ScrollSegmentProps) => {
  const width = useTransform(springPercent, (p) => {
    const current = (p / 100) * (SEGMENTS - 1);
    const distance = index - current;
    const wave = Math.exp(-0.5 * Math.pow(distance / 2, 2));
    const minWidth = 8;
    const maxWidth = 40;
    return minWidth + wave * (maxWidth - minWidth);
  });

  const backgroundColor = useTransform(springPercent, (p) => {
    const current = (p / 100) * (SEGMENTS - 1);
    const distance = index - current;
    const wave = Math.exp(-0.5 * Math.pow(distance / 4, 2));
    const opacity = 0.2 + wave * 0.9;
    return `rgba(255,255,255,${opacity})`;
  });

  return (
    <motion.div className="flex justify-center w-full">
      <motion.div
        className="h-0.5 rounded-sm shadow-sm ml-auto"
        style={{ width, backgroundColor }}
      />
    </motion.div>
  );
};

const ScrollBarIndicator = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const maxScroll = scrollHeight - clientHeight;
      const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollPercent(percent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Framer spring value
  const motionPercent = useMotionValue(scrollPercent);
  const springPercent = useSpring(motionPercent, { stiffness: 50, damping: 30, mass: 0.5 });

  // Update motion value when scrollPercent changes
  useEffect(() => {
    motionPercent.set(scrollPercent);
  }, [scrollPercent, motionPercent]);

  return (
    <div className="fixed top-[50%] right-2 -translate-y-1/2 w-15 h-[80%] 
      mix-blend-difference flex justify-center items-center pointer-events-none z-[9999]">
      <div className="rounded-full py-8 h-[90%] w-full flex flex-col gap-1 justify-between pointer-events-none">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <ScrollSegment key={i} index={i} springPercent={springPercent} />
        ))}
      </div>
    </div>
  );
};

export default ScrollBarIndicator;
