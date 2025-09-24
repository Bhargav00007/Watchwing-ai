// app/about/page.tsx
"use client";

import React from "react";

export default function AboutPage() {
  return (
    <main className="min-h-screen  text-gray-300 p-8 my-30 mx-auto">
      {/* Page Container */}
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Introduction */}
        <section>
          <h1 className="lg:text-5xl text-4xl font-bold text-start mb-6">
            INTRODUCTION
          </h1>
          <p className="text-lg leading-relaxed">
            Watch Wing AI is a powerful browser extension that seamlessly
            integrates artificial intelligence into your everyday browsing
            experience. Instead of switching between apps or tools, Watch Wing
            AI brings smart, context-aware assistance directly onto your screen,
            saving you time and enhancing productivity.
          </p>
        </section>

        {/* What is Extension */}
        <section>
          <h2 className="text-3xl  text-start mb-4">What is Extension?</h2>
          <p className="text-lg leading-relaxed">
            A browser extension is a lightweight software that adds new
            functionality to your web browser. Watch Wing AI takes advantage of
            this by embedding advanced AI tools right where you need them—
            directly on the web pages you visit—without extra setup or complex
            workflows.
          </p>
        </section>

        {/* Why Watch Wing AI */}
        <section>
          <h2 className="text-3xl   text-start mb-4">Why Watch Wing AI?</h2>
          <p className="text-lg leading-relaxed">
            Unlike traditional solutions, Watch Wing AI focuses on speed,
            simplicity, and convenience. It enables you to access AI-powered
            insights in real-time, without distractions or unnecessary steps.
            Its minimal design ensures that AI feels like a natural part of your
            browsing experience.
          </p>
        </section>

        {/* Why Not Traditional AI Chatbots */}
        <section>
          <h2 className="text-3xl   text-start mb-4">
            Why Not Traditional AI Chatbots?
          </h2>
          <p className="text-lg leading-relaxed">
            Traditional chatbots often require you to open separate apps, log
            in, or paste content manually. This interrupts your workflow and
            reduces efficiency. Watch Wing AI eliminates these barriers by
            providing instant assistance right inside your browser—no switching
            tabs, no breaking focus.
          </p>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-3xl   text-start mb-4">How It Works</h2>
          <p className="text-lg leading-relaxed">
            Watch Wing AI works as a smart background assistant that activates
            whenever you need it. Once installed, it adds a simple AI button on
            your screen. When clicked, the extension securely captures the
            visible context of your screen and sends it to Google Gemini. Gemini
            then analyzes the content in real time—allowing you to ask
            questions, solve problems, or generate insights instantly, all
            without switching tabs or disrupting your browsing flow.
          </p>
        </section>
      </div>
    </main>
  );
}
