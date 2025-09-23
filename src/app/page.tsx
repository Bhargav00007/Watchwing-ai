import { BentoGrid } from "@/components/BentoGrid";
import Hero from "@/components/Hero";
import Laptop from "@/components/Laptop";
import { PowerUsage } from "@/components/PowerUsage";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero />
      <Laptop />
      <div className="lg:px-60 p-10 my-20">
        <BentoGrid />
      </div>
      <div className=" my-20">
        <PowerUsage />
      </div>
    </div>
  );
};

export default page;
