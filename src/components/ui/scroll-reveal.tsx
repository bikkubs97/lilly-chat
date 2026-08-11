"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type ScrollRevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  ...props
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16, scale: shouldReduceMotion ? 1 : 0.995 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.22, margin: "0px 0px -48px 0px" }}
      transition={{
        type: shouldReduceMotion ? "tween" : "spring",
        stiffness: 180,
        damping: 26,
        mass: 0.8,
        duration: shouldReduceMotion ? 0.18 : undefined,
        delay,
      }}
      {...props}
      className={className}
      style={{ ...props.style, willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}
