// app/about/page.tsx
"use client";

import React from "react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen text-gray-300 p-8 my-30 mx-auto">
      {/* Page Container */}
      <div className="max-w-3xl mx-auto space-y-16">
        {/* Documentation Header */}
        <section>
          <h1 className="lg:text-5xl text-4xl font-bold text-start mb-6">
            TECHNICAL DOCUMENTATION
          </h1>
          <p className="text-lg leading-relaxed">
            Comprehensive technical overview of Watch Wing AI&apos;s
            architecture, data flow, and error handling mechanisms.
          </p>
        </section>

        {/* Frontend Architecture */}
        <section>
          <h2 className="text-3xl font-bold text-start mb-6 text-blue-400">
            Frontend Architecture
          </h2>
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="text-xl font-semibold mb-3">Core Components</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>UI Manager</strong> - Creates and manages chat
                    interface
                  </li>
                  <li>
                    <strong>Chat Manager</strong> - Handles message flow and AI
                    communication
                  </li>
                  <li>
                    <strong>Drag Manager</strong> - Enables window dragging
                    functionality
                  </li>
                  <li>
                    <strong>Session Manager</strong> - Persists chat history and
                    settings
                  </li>
                  <li>
                    <strong>Voice Manager</strong> - Handles speech recognition
                    and synthesis
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-3">Key Features</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>Real-time screenshot capture</li>
                  <li>Draggable and resizable window</li>
                  <li>Voice input/output capabilities</li>
                  <li>Session persistence</li>
                  <li>Responsive design</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Backend Architecture */}
        <section>
          <h2 className="text-3xl font-bold text-start mb-6 text-green-400">
            Backend Architecture
          </h2>
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="text-xl font-semibold mb-3">
                  Processing Pipeline
                </h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Request Validation</strong> - Verify input data and
                    API keys
                  </li>
                  <li>
                    <strong>Image Processing</strong> - Handle base64 screenshot
                    data
                  </li>
                  <li>
                    <strong>Context Building</strong> - Combine image +
                    conversation history
                  </li>
                  <li>
                    <strong>Prompt Engineering</strong> - Create optimized AI
                    prompts
                  </li>
                  <li>
                    <strong>Response Formatting</strong> - Clean and structure
                    AI output
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-3">AI Integration</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>Google Gemini API integration</li>
                  <li>Vision capabilities for image analysis</li>
                  <li>Conversation context preservation</li>
                  <li>Real-time response generation</li>
                  <li>Error handling and fallbacks</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Error Handling System */}
        <section>
          <h2 className="text-3xl font-bold text-start mb-6 text-red-400">
            Error Handling System
          </h2>
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 space-y-6">
            {/* Replaced Graph with Image */}
            <div className="flex justify-center">
              <Image
                src="/assets/errorgraph.png"
                alt="Error Handling System Flow"
                width={900}
                height={500}
                className="rounded-lg border border-gray-700"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="text-xl font-semibold mb-3">
                  Error Types Handled
                </h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>API Quota Exceeded</strong> - Gemini usage limits
                    reached
                  </li>
                  <li>
                    <strong>Rate Limiting</strong> - Too many requests
                  </li>
                  <li>
                    <strong>Network Issues</strong> - Connection failures
                  </li>
                  <li>
                    <strong>Invalid Input</strong> - Malformed requests
                  </li>
                  <li>
                    <strong>Service Unavailable</strong> - Backend/AI service
                    down
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-3">
                  Recovery Mechanisms
                </h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>User-friendly error messages</li>
                  <li>Automatic retry suggestions</li>
                  <li>Session preservation during failures</li>
                  <li>Graceful feature degradation</li>
                  <li>Comprehensive error logging</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section>
          <h2 className="text-3xl font-bold text-start mb-6 text-gray-400">
            Technical Specifications
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-300">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-semibold mb-4">Frontend Stack</h4>
              <ul className="space-y-2">
                <li>
                  <strong>Framework:</strong> Chrome Extension + Content Scripts
                </li>
                <li>
                  <strong>Language:</strong> JavaScript/TypeScript
                </li>
                <li>
                  <strong>UI:</strong> Custom CSS with Dark Theme
                </li>
                <li>
                  <strong>Storage:</strong> Chrome Storage API + Session Storage
                </li>
                <li>
                  <strong>APIs:</strong> Chrome Tabs, Web Speech, Clipboard
                </li>
              </ul>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-semibold mb-4">Backend Stack</h4>
              <ul className="space-y-2">
                <li>
                  <strong>Runtime:</strong> Node.js / Vercel Functions
                </li>
                <li>
                  <strong>AI Provider:</strong> Google Gemini API
                </li>
                <li>
                  <strong>Image Processing:</strong> Base64 + Vision AI
                </li>
                <li>
                  <strong>Authentication:</strong> API Key Validation
                </li>
                <li>
                  <strong>Error Handling:</strong> Comprehensive Status Codes
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
