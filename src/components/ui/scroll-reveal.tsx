"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type ScrollRevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  ...props
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.995 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.22, margin: "0px 0px -48px 0px" }}
      transition={{
        type: "spring",
        stiffness: 70,
        damping: 18,
        mass: 0.7,
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
