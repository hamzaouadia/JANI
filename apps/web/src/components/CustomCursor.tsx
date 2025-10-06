"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);

  const verticalRef1 = useRef<HTMLDivElement>(null);
  const verticalRef2 = useRef<HTMLDivElement>(null);
  const horizontalRef1 = useRef<HTMLDivElement>(null);
  const horizontalRef2 = useRef<HTMLDivElement>(null);
  const gapRef = useRef<HTMLDivElement>(null);

  const gap = 20; // default small square

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let hoveredEl: HTMLElement | null = null; // Moved inside useEffect to fix ESLint warning

    const v1 = verticalRef1.current!;
    const v2 = verticalRef2.current!;
    const h1 = horizontalRef1.current!;
    const h2 = horizontalRef2.current!;
    const gapEl = gapRef.current!;

    const moveHandler = (e: MouseEvent) => {
      let x = e.clientX;
      let y = e.clientY;
      let targetWidth = gap;
      let targetHeight = gap;

      // If hovering → lock to element center & dimensions
      if (hoveredEl) {
        const rect = hoveredEl.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
        targetWidth = rect.width;
        targetHeight = rect.height;
      }

      // Vertical lines
      gsap.to(v1, {
        x,
        height: y - targetHeight / 2 - 5,
        duration: 0.3,
        ease: "power3.out",
      });
      gsap.to(v2, {
        x,
        height: window.innerHeight - y - targetHeight / 2 - 5,
        duration: 0.3,
        ease: "power3.out",
      });

      // Horizontal lines
      gsap.to(h1, {
        y,
        width: x - targetWidth / 2 - 5,
        duration: 0.3,
        ease: "power3.out",
      });
      gsap.to(h2, {
        y,
        width: window.innerWidth - x - targetWidth / 2 - 5,
        duration: 0.3,
        ease: "power3.out",
      });

      // Gap rectangle
      gsap.to(gapEl, {
        x: x - targetWidth / 2,
        y: y - targetHeight / 2,
        width: targetWidth,
        height: targetHeight,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    // Hover enter → lock rect
    const hoverHandler = (e: Event) => {
      hoveredEl = e.currentTarget as HTMLElement;
      const rect = hoveredEl.getBoundingClientRect();
      gsap.to(gapEl, {
        width: rect.width,
        height: rect.height,
        x: rect.left,
        y: rect.top,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    // Hover leave → release lock
    const leaveHandler = () => {
      hoveredEl = null;
      gsap.to(gapEl, {
        width: gap,
        height: gap,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    const expandables = document.querySelectorAll<HTMLElement>(
      ".cursor-expand"
    );
    expandables.forEach((el) => {
      el.addEventListener("mouseenter", hoverHandler);
      el.addEventListener("mouseleave", leaveHandler);
    });

    document.addEventListener("mousemove", moveHandler);

    return () => {
      document.removeEventListener("mousemove", moveHandler);
      expandables.forEach((el) => {
        el.removeEventListener("mouseenter", hoverHandler);
        el.removeEventListener("mouseleave", leaveHandler);
      });
      gsap.killTweensOf([v1, v2, h1, h2, gapEl]);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[0] opacity-70">
      {/* Vertical dashed lines */}
      <div
        ref={verticalRef1}
        className="absolute top-0 left-0 w-[1px] border-l-2 border-dashed border-[#77af9c]/50"
      />
      <div
        ref={verticalRef2}
        className="absolute bottom-0 left-0 w-[1px] border-l-2 border-dashed border-[#77af9c]/50"
      />
      {/* Horizontal dashed lines */}
      <div
        ref={horizontalRef1}
        className="absolute top-0 left-0 h-[1px] border-t-2 border-dashed border-[#77af9c]/50"
      />
      <div
        ref={horizontalRef2}
        className="absolute top-0 right-0 h-[1px] border-t-2 border-dashed border-[#77af9c]/50"
      />
      {/* Gap rectangle */}
      <div
        ref={gapRef}
        className="absolute border-2 border-[#77af9c] rounded-sm"
      />
    </div>
  );
}
