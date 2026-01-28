"use client";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface GridPatternCardProps {
  children: React.ReactNode;
  className?: string;
  patternClassName?: string;
  gradientClassName?: string;
}

export function GridPatternCard({
  children,
  className,
  patternClassName,
  gradientClassName,
}: GridPatternCardProps) {
  return (
    <motion.div
      className={cn(
        "border w-full rounded-md overflow-hidden",
        " bg-zinc-950",
        " border-zinc-900",
        className,
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div
        className={cn(
          "size-full bg-repeat bg-[length:50px_50px]",
          " bg-square-pattern",
          patternClassName,
        )}
      >
        <div
          className={cn(
            "size-full bg-gradient-to-tr",
            "from-zinc-950 via-zinc-950/[.85] to-zinc-950",
            gradientClassName,
          )}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export function GridPatternCardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-left p-4 md:p-6", className)} {...props} />;
}
