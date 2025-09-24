"use client";

import { RetroGrid } from "../components/ui/RetroGrid";
import { FaChrome, FaEdge } from "react-icons/fa";
import { SiBrave } from "react-icons/si";

export function RetroGridBackground() {
  return (
    <div className="relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden rounded-lg md:shadow-xl space-y-6">
      {/* Heading */}
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-3xl lg:text-5xl font-semibold leading-none tracking-tighter text-transparent">
        Available on all Platforms
      </span>

      {/* Subheading */}
      <p className="text-gray-400 text-center max-w-2xl px-4">
        Available on Chrome, Edge and Brave on macOS, Windows and Linux.
      </p>

      {/* Browser Icons */}
      <div className="flex items-center space-x-6 text-4xl text-gray-300">
        <FaChrome title="Chrome" />
        <FaEdge title="Edge" />
        <SiBrave title="Brave" />
      </div>

      {/* Add to Chrome Button */}
      <button className="flex items-center gap-2 bg-white text-gray-800 px-5 py-2 rounded-md shadow-md hover:shadow-lg transition">
        <FaChrome className="text-xl " />
        Add to Chrome
      </button>

      {/* Retro Grid */}
      <RetroGrid />
    </div>
  );
}
