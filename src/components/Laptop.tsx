"use client";
import React, { useEffect, useRef, useState } from "react";

const LaptopPage = () => {
  const codeLines = [
    { code: "function add(a, b) {", color: "text-blue-400" },
    { code: "  return a + b", color: "text-green-400" },
    { code: "}", color: "text-blue-400" },
    { code: "", color: "" },
    { code: "const result = add(5)", color: "text-red-500" },
    { code: "console.log(result)", color: "text-yellow-400" },
  ];

  const userQuestion = "Why am i getting errors?";
  const aiAnswer =
    "You called `add` with only one argument, but the function requires two parameters.";

  const [typedQuestion, setTypedQuestion] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [started, setStarted] = useState(false);
  const laptopRef = useRef(null);

  // Animation on scroll into view
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (laptopRef.current) observer.observe(laptopRef.current);
    return () => observer.disconnect();
  }, []);

  // Typing animation
  useEffect(() => {
    if (!started) return;
    let i = 0;
    setTypedQuestion("");
    setShowAI(false);
    const interval = setInterval(() => {
      setTypedQuestion(userQuestion.slice(0, i + 1));
      i++;
      if (i === userQuestion.length) {
        clearInterval(interval);
        setTimeout(() => setShowAI(true), 2000);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [started]);

  return (
    <div className="flex flex-col items-center min bg-[#0d0716] p-3 sm:p-8">
      {/* Main heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-1 mt-20 text-center drop-shadow-lg">
        Ask anything, get instant answers
      </h2>
      {/* Laptop + AI section */}
      <div
        className="flex justify-center items-center w-full lg:mt-10"
        style={{ minHeight: "30vh" }}
      >
        <div
          className="flex flex-col items-center w-full max-w-xs sm:max-w-md md:max-w-lg xl:max-w-xl relative"
          ref={laptopRef}
        >
          {/* Laptop Top Bar */}
          <div className="bg-gray-800 rounded-t-lg px-3 py-2 w-full flex justify-start items-center">
            <div className="flex gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
          </div>
          {/* Laptop Screen */}
          <div className="relative bg-gray-900 rounded-b-lg shadow-lg overflow-hidden w-full h-[170px] sm:h-[220px] md:h-[260px] lg:h-[300px] border border-gray-700 z-10">
            <div className="w-full h-full bg-black text-white font-mono p-3 sm:p-4 overflow-hidden">
              <pre className="text-xs sm:text-sm md:text-base leading-6">
                {codeLines.map((line, idx) => (
                  <div key={idx} className={line.color}>
                    {line.code}
                  </div>
                ))}
              </pre>
            </div>
          </div>
          {/* WatchWing AI popup - pops out for all sizes */}
          {/* Negative offsets at all breakpoints for "pop out" effect */}
          <div
            className="
              absolute z-30
              -right-7 -bottom-32
              sm:-right-16 sm:-bottom-28
              md:-right-24 md:-bottom-20
              xl:-right-32 xl:-bottom-12
            "
          >
            <div
              className="
    bg-gray-950/95 backdrop-blur-2xl 
    rounded-2xl
    w-[88vw] max-w-xs
    sm:w-[360px] sm:max-w-sm
    md:w-[430px] md:max-w-sm
    xl:w-[520px] xl:max-w-xl
    p-4 sm:p-3 md:p-5
    shadow-2xl flex flex-col
    border border-gray-900
    h-40 lg:h-48 md:h-34 overflow-auto
  "
            >
              {/* Popup header */}
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-purple-300 text-base sm:text-lg">
                  WatchWing AI
                </span>
                <button className="font-bold text-white  rounded-full w-6 h-6 flex items-center justify-center hover:text-white/80 cursor-pointer text-base">
                  ✕
                </button>
              </div>
              {/* Fake input typing */}
              <div className="bg-gray-800 rounded-md p-2 sm:p-3 text-white h-6 sm:h-8 flex items-center overflow-hidden text-sm sm:text-base md:text-lg">
                <span>{typedQuestion}</span>
                <span className="animate-blink ml-1">{started ? "|" : ""}</span>
              </div>
              {/* AI response */}
              {showAI && (
                <div className="mt-3 bg-gray-900 text-green-400 rounded-md p-2 sm:p-3 text-sm sm:text-base animate-fadeIn">
                  {aiAnswer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Info subheading below */}
      <div className="mt-34 lg:mt-20 text-center w-full">
        <div className="text-gray-200 font-medium text-base sm:text-lg mb-20">
          No need to copy-paste code to solve errors—get instant feedback here!
        </div>
      </div>
      {/* Tailwind Animations */}
      <style>
        {`
          @keyframes blink {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0; }
          }
          .animate-blink {
            animation: blink 1s step-start infinite;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default LaptopPage;
