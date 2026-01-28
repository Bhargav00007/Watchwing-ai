"use client";

import { useEffect, useState } from "react";
import { GridPatternCard, GridPatternCardBody } from "../about/GridCard";

export default function DownloadPage() {
  const [downloads, setDownloads] = useState<number>(0);

  useEffect(() => {
    fetch("/api/downloads")
      .then((res) => res.json())
      .then((data) => setDownloads(data.count));
  }, []);

  const handleDownload = async () => {
    const res = await fetch("/api/downloads", { method: "POST" });
    const data = await res.json();
    setDownloads(data.count);

    // Redirect to GitHub repo
    window.open(
      "https://github.com/Bhargav00007/WatchWing-Extension",
      "_blank",
    );
  };

  return (
    <main className="min-h-screen mx-auto max-w-4xl text-gray-300 p-8 my-30">
      {/* Heading */}
      <h1 className="lg:text-5xl text-4xl font-bold text-start mb-2">
        Become a Beta Tester
      </h1>
      <p className="text-gray-400 text-lg mb-8">
        Download the latest version from GitHub and start testing today.
      </p>

      {/* Card with version info + download */}
      <GridPatternCard>
        <GridPatternCardBody>
          <h3 className="text-lg font-bold mb-1 text-white">
            WatchWing AI – Beta Release
          </h3>
          <p className="text-sm text-gray-400 mb-1">Version 1.2.0</p>
          <p className="text-xs text-gray-500 mb-3">1 September 2025</p>

          <p className="text-wrap text-sm text-white/60 mb-4">
            This beta release introduces the foundation of WatchWing AI,
            allowing you to capture your screen context and get instant,
            intelligent responses powered by Google Gemini—directly in your
            browser without switching tabs.
          </p>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-[#1a013a] text-white rounded-lg shadow-lg hover:bg-[#1a014b] cursor-pointer"
          >
            Download
          </button>

          {/* Counter */}
          <p className="mt-4 text-sm text-gray-400">
            Total Downloads:{" "}
            <span className="font-semibold text-white">{downloads}</span>
          </p>
        </GridPatternCardBody>
      </GridPatternCard>
    </main>
  );
}
