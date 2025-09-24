import React from "react";
import { GridPatternCard, GridPatternCardBody } from "../GridCard";

const page = () => {
  return (
    <main className="min-h-screen mx-auto max-w-4xl text-gray-300 p-8 my-30 mx-auto">
      <h1 className="lg:text-5xl text-4xl font-bold text-start mb-6">
        RELEASE NOTES
      </h1>
      <GridPatternCard>
        <GridPatternCardBody>
          <h3 className="text-lg font-bold mb-1 text-foreground">
            WatchWing AI – The First
          </h3>
          <p className="text-sm text-gray-400 mb-1">Version 1.0.0</p>
          <p className="text-xs text-gray-500 mb-3">23 September 2025</p>

          <p className="text-wrap text-sm text-foreground/60">
            The very first release of WatchWing AI introduced core vision:
            bringing the power of AI directly into your browser. Version 1.0.0
            allowed users to capture their on-screen context and get instant
            answers powered by Google Gemini—without switching tabs or breaking
            their flow. This version laid the foundation for seamless, real-time
            AI assistance right where you need it.
          </p>
        </GridPatternCardBody>
      </GridPatternCard>
    </main>
  );
};

export default page;
