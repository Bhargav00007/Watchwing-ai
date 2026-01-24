"use client";
import { useState, useEffect, useRef } from "react";
import Loading from "../components/ui/Loading";

export default function Showreel() {
  const [isLoading, setIsLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!videoLoaded) {
        setIsLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [videoLoaded]);

  const handleLoadedData = () => {
    setIsLoading(false);
    setVideoLoaded(true);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-lg  mb-20 mt-10 my-20">
          <Loading />
        </div>
      )}

      {!isLoading && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded-3xl mx-auto mt-20 px-4 py-6 
             w-full max-w-[90%] 
             md:max-w-[720px] 
             lg:max-w-[640px] 
             xl:max-w-[900px]"
          controls
          controlsList="nodownload"
          src={"/showreel0.mp4"}
          onLoadedData={handleLoadedData}
        />
      )}
    </div>
  );
}
