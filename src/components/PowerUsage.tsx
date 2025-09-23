"use client";

import { CpuArchitecture } from "../components/ui/Power";

export const PowerUsage = () => {
  return (
    <div className="p-4 rounded-xl bg-accent/20 max-w-xl mx-auto text-center space-y-3">
      {/* Heading */}
      <h2 className="text-2xl font-bold  text-white">Free for Everyone</h2>
      {/* Subheading */}
      <p className="text-sm text-gray-600 text-gray-400">
        Powered by Google Gemini
      </p>

      {/* CPU Architecture Component */}
      <CpuArchitecture />
    </div>
  );
};
