"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function CountUp({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  className = "",
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  const animateCount = useCallback(() => {
    const startTime = performance.now();
    const startValue = 0;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuart);

      setCount(currentCount);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(updateCount);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateCount);
  }, [duration, end]);

  useEffect(() => {
    hasAnimated.current = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount();
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
      const rect = countRef.current.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (isVisible && !hasAnimated.current) {
        hasAnimated.current = true;
        animateCount();
      }
    }

    return () => {
      observer.disconnect();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end, duration, animateCount]);

  return (
    <span ref={countRef} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
