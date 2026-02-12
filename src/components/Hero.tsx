import RippleGrid from "@/components/RippleGrid";
import React from "react";
import Link from "next/link";
import DecryptedText from "./DecryptedText";

const Hero = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* RippleGrid background */}
      <RippleGrid
        enableRainbow={true}
        gridColor="#5227ff"
        rippleIntensity={0.05}
        gridSize={10}
        gridThickness={50}
        mouseInteraction={true}
        mouseInteractionRadius={0.8}
        opacity={0.8}
        glowIntensity={0.1}
      />

      {/* Hero overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 pointer-events-none">
        {/* Badge on top */}
        <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 font-semibold text-white pointer-events-auto">
          Web AI Assistant
        </div>

        {/* Tagline */}
        <h1 className="text-gray-200 text-4xl md:text-6xl font-semibold max-w-3xl leading-snug mb-6 pointer-events-auto">
          Smarter Browsing with AI, Right on Your Screen.
        </h1>

        {/* Sub-tagline */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-thin mb-8 px-6 pointer-events-auto">
          Use the WatchWing AI browser extension for bringing the full power of
          artificial intelligence directly to your screen.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
          <Link href="/download">
            <button className="px-12 py-3 rounded-full cursor-pointer bg-[#1a013a] text-white font-semibold hover:bg-[#2b0257] transition">
              Add to Chrome
            </button>
          </Link>
          <Link href="/about">
            <button className="px-12 py-3 rounded-full cursor-pointer bg-white/5 backdrop-blur-md text-white font-semibold hover:bg-white/10border border-gray-500 transition">
              {" "}
              Learn More{" "}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
