import { BentoGrid } from "@/components/BentoGrid";
import Hero from "@/components/Hero";
import Laptop from "@/components/Laptop";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero />
      <Laptop />
      <div className="lg:px-60 p-10 my-20">
        <BentoGrid />
      </div>
    </div>
  );
};

export default page;
