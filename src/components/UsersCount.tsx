"use client";
import React, { useEffect, useState } from "react";
import CountUp from "../components/ui/CountUp";

// Simple gradient wrapper
const GradientText = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold">
    {children}
  </span>
);

const UserCount = () => {
  const [downloads, setDownloads] = useState<number>(0);
  const [users, setUsers] = useState<number>(0);

  // Fetch download count
  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const res = await fetch("/api/downloads");
        const data = await res.json();
        if (data?.count !== undefined) setDownloads(data.count);
      } catch (err) {
        console.error("Error fetching downloads:", err);
      }
    };
    fetchDownloads();
  }, []);

  return (
    <section className="w-full py-12 bg-[#000000] flex justify-center items-center">
      <div className="w-full max-w-3xl flex flex-row flex-wrap justify-center items-center lg:gap-10 gap-4 px-4">
        {/* Downloads Counter */}
        <div className="flex-1 min-w-[150px]  shadow-md shadow-[#1f1f1f] rounded-2xl p-5 sm:p-8 text-center transition-transform ">
          <GradientText>
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-1 font-bold text-gray-300">
              <CountUp
                from={0}
                to={downloads}
                separator=","
                direction="up"
                duration={2}
                className="count-up-text"
              />
            </h2>
          </GradientText>
          <p className="text-gray-400 text-sm sm:text-base mt-1">Downloads</p>
        </div>

        {/* Users Counter */}
        <div className="flex-1 min-w-[150px] shadow-md shadow-[#1f1f1f] rounded-2xl p-5 sm:p-8 text-center transition-transform ">
          <GradientText>
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-1 font-bold text-gray-300">
              <CountUp
                from={0}
                to={9}
                separator=","
                direction="up"
                duration={2}
                className="count-up-text"
              />
            </h2>
          </GradientText>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Active Users
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserCount;
