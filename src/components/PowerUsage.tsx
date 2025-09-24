"use client";

import { CpuArchitecture } from "../components/ui/Power";
import { useRef } from "react";
import { useInView } from "framer-motion";

export const PowerUsage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  // once:true ensures it runs only once, margin triggers a bit earlier

  return (
    <div
      ref={ref}
      className="p-4 rounded-xl bg-accent/20 max-w-xl mx-auto text-center space-y-3"
    >
      {/* Heading */}
      <h2 className="text-2xl font-bold text-white">Free for Everyone</h2>

      {/* Subheading */}
      <p className="text-sm text-gray-400">Powered by Google Gemini</p>

      {/* CPU Architecture Component */}
      {isInView && <CpuArchitecture />}
    </div>
  );
};
