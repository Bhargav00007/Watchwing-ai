import { BentoGrid } from "@/components/BentoGrid";
import Hero from "@/components/Hero";
import Laptop from "@/components/Laptop";
import { PowerUsage } from "@/components/PowerUsage";
import { RetroGridBackground } from "@/components/RetroGridBackground";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero />
      <Laptop />
      <div className="lg:px-60 p-10 my-20">
        <BentoGrid />
      </div>
      <div className=" mt-20">
        <PowerUsage />
      </div>
      <RetroGridBackground />
    </div>
  );
};

export default page;
