// app/terms/page.tsx
"use client";

import React from "react";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen text-gray-300 p-6 md:p-8 my-16 mx-auto">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <section className="text-start border-b border-gray-800 py-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400 text-lg">
            Effective Date:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </section>

        {/* 1. Agreement to Terms */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            1. Agreement to Terms
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            By accessing and using Watchwing AI (&quot;the Extension&quot;), you
            agree to be bound by these Terms of Service. If you disagree with
            any part of these terms, you may not use our Extension.
          </p>
          <p className="text-gray-300 leading-relaxed">
            These terms apply to all users of the Extension, including users who
            are contributors of content, information, and other materials or
            services.
          </p>
        </section>

        {/* 2. Description of Service */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            2. Description of Service
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            Watchwing AI is a browser extension that provides real-time AI
            assistance directly within your browsing experience. The Extension
            uses Google&apos;s Gemini 2.5 Flash model to process content and
            provide intelligent responses based on the context of your current
            browsing session.
          </p>
          <p className="text-gray-300 leading-relaxed">
            The Extension includes voice input capabilities using your
            device&apos;s microphone for convenience. Microphone access is
            optional and only used when you explicitly activate voice input.
          </p>
        </section>

        {/* 3. Privacy and Data Handling */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            3. Privacy and Data Handling
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            Your privacy is fundamental to our service. We operate on a strict
            no-data-collection policy:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>
              We do not collect, store, or transmit any personal information
            </li>
            <li>
              All processing occurs in real-time through secure, encrypted
              connections
            </li>
            <li>
              Chat history is stored exclusively in your browser&apos;s session
              storage
            </li>
            <li>
              All session data is automatically deleted when you close the tab
              or browser
            </li>
            <li>
              We do not have access to your browsing history, bookmarks, or
              personal data
            </li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            Voice input via microphone is processed locally and only the
            transcribed text is sent for AI processing. Audio data is never
            stored or transmitted.
          </p>
        </section>

        {/* 4. User Responsibilities */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            4. User Responsibilities
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            You agree to use the Extension in compliance with all applicable
            laws and regulations. You shall not:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>
              Use the Extension for any illegal purposes or in violation of any
              laws
            </li>
            <li>
              Attempt to reverse engineer, decompile, or disassemble the
              Extension
            </li>
            <li>
              Use the Extension to generate harmful, abusive, or illegal content
            </li>
            <li>
              Interfere with or disrupt the integrity or performance of the
              Extension
            </li>
          </ul>
        </section>

        {/* 5. Intellectual Property */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            5. Intellectual Property
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            The Watchwing AI Extension, including its design, features, and
            functionality, is owned by Watchwing AI and protected by
            intellectual property laws. The Extension is provided for personal,
            non-commercial use only.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Google Gemini is a trademark of Google LLC. Watchwing AI is not
            affiliated with, endorsed by, or sponsored by Google LLC.
          </p>
        </section>

        {/* 6. AI Processing and Limitations */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            6. AI Processing and Limitations
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            The Extension uses Google&apos;s Gemini 2.5 Flash model for AI
            processing. We do not control, modify, or store the outputs
            generated by this AI model. You acknowledge that:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>AI-generated content may contain inaccuracies or errors</li>
            <li>
              You are responsible for verifying the accuracy of any AI-generated
              content
            </li>
            <li>
              The Extension provides assistance but does not replace
              professional advice
            </li>
            <li>
              AI responses are generated based on patterns and may not reflect
              current information
            </li>
          </ul>
        </section>

        {/* 7. Technical Requirements */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            7. Technical Requirements
          </h2>
          <p className="text-gray-300 leading-relaxed">
            The Extension requires a compatible web browser with JavaScript
            enabled. Voice input functionality requires microphone access
            permission from your browser. The Extension does not function
            properly in browsers that restrict necessary APIs or permissions.
          </p>
        </section>

        {/* 8. Disclaimer of Warranties */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            8. Disclaimer of Warranties
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            The Extension is provided &quot;as is&quot; and &quot;as
            available&quot; without warranties of any kind, either express or
            implied. We do not warrant that:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-3">
            <li>The Extension will meet your specific requirements</li>
            <li>
              The Extension will be uninterrupted, timely, secure, or error-free
            </li>
            <li>
              The results obtained from using the Extension will be accurate or
              reliable
            </li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            You expressly understand and agree that your use of the Extension is
            at your sole risk.
          </p>
        </section>

        {/* 9. Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            9. Limitation of Liability
          </h2>
          <p className="text-gray-300 leading-relaxed">
            In no event shall Watchwing AI, its developers, or affiliates be
            liable for any indirect, incidental, special, consequential, or
            punitive damages, including without limitation, loss of profits,
            data, use, goodwill, or other intangible losses, resulting from your
            access to or use of or inability to access or use the Extension.
          </p>
        </section>

        {/* 10. Modifications to Terms */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            10. Modifications to Terms
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            We reserve the right to modify or replace these Terms at any time.
            If a revision is material, we will provide at least 30 days&apos;
            notice prior to any new terms taking effect.
          </p>
          <p className="text-gray-300 leading-relaxed">
            By continuing to access or use our Extension after those revisions
            become effective, you agree to be bound by the revised terms.
          </p>
        </section>

        {/* 11. Governing Law */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            11. Governing Law
          </h2>
          <p className="text-gray-300 leading-relaxed">
            These Terms shall be governed and construed in accordance with
            applicable laws, without regard to its conflict of law provisions.
          </p>
        </section>

        {/* 12. Contact Information */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            12. Contact Information
          </h2>
          <p className="text-gray-300 leading-relaxed">
            If you have any questions about these Terms, please contact us
            through our website&apos;s{" "}
            <a href="/contact" className="text-blue-400 hover:underline">
              Contact Page
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
