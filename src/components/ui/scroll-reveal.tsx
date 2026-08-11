import type { HTMLAttributes } from "react";

type ScrollRevealProps = HTMLAttributes<HTMLDivElement> & {
  delay?: number;
};

export default function ScrollReveal({
  children,
  className,
  delay,
  ...props
}: ScrollRevealProps) {
  void delay;

  return (
    <div {...props} className={className}>
      {children}
    </div>
  );
}
