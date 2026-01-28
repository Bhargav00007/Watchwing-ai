// app/privacy/page.tsx
"use client";

import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen text-gray-300 p-6 md:p-8 my-16 mx-auto">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <section className="text-start border-b border-gray-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold my-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg">
            Effective Date:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-gray-300 mt-4">
            At Watchwing AI, we believe privacy is not just a feature—it&apos;s
            our fundamental design principle.
          </p>
        </section>

        {/* 1. Introduction */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            1. Introduction
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            This Privacy Policy explains how Watchwing AI (&quot;we&quot;,
            &quot;our&quot;, or &quot;us&quot;) handles information in relation
            to your use of our browser extension. We are committed to protecting
            your privacy and have designed our service with privacy as the core
            principle.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Our approach is simple: we minimize data collection, maximize
            transparency, and ensure you maintain control over your information.
          </p>
        </section>

        {/* 2. Information We Do Not Collect */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            2. Information We Do Not Collect
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            To be absolutely clear, we do not collect, store, or transmit any
            personal information. This includes:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>
              Personal identification information (name, email, address, etc.)
            </li>
            <li>Browsing history or search history</li>
            <li>Location data or IP addresses</li>
            <li>Device information or unique identifiers</li>
            <li>Cookies or tracking technologies</li>
            <li>Payment information (the Extension is free)</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            We have no servers that store user data, no databases containing
            personal information, and no analytics tracking your usage.
          </p>
        </section>

        {/* 3. How the Extension Works */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            3. How the Extension Works
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            When you use Watchwing AI, the following occurs:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>
              The Extension reads the visible content of your current tab when
              you activate it
            </li>
            <li>
              This content is sent via encrypted HTTPS connection to
              Google&apos;s Gemini API
            </li>
            <li>
              Google Gemini 2.5 Flash processes the request and returns a
              response
            </li>
            <li>The response is displayed within the Extension interface</li>
            <li>
              Voice input is processed locally via Web Speech API, and only
              transcribed text is sent
            </li>
            <li>
              All conversation data is stored temporarily in browser session
              storage
            </li>
          </ul>
        </section>

        {/* 4. Voice Input and Microphone Usage */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            4. Voice Input and Microphone Usage
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            The Extension offers optional voice input functionality. When you
            choose to use voice input:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>
              Your browser will request microphone permission (you can decline)
            </li>
            <li>
              Voice audio is processed locally using your browser&apos;s Web
              Speech API
            </li>
            <li>Audio data never leaves your device and is not stored</li>
            <li>Only the transcribed text result is sent for AI processing</li>
            <li>
              You can disable microphone access at any time through browser
              settings
            </li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            We do not have access to your microphone data, and voice processing
            occurs entirely within your browser&apos;s secure sandbox
            environment.
          </p>
        </section>

        {/* 5. Session Storage */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            5. Session Storage
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            To maintain conversation continuity during your browsing session,
            the Extension uses your browser&apos;s session storage. This is
            temporary storage that:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>Exists only while your browser tab is open</li>
            <li>Is automatically cleared when you close the tab</li>
            <li>
              Is isolated to the specific tab where the Extension is active
            </li>
            <li>Cannot be accessed by other tabs or websites</li>
            <li>Is not transmitted to any servers</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            No persistent storage is used, and there are no long-term records of
            your conversations.
          </p>
        </section>

        {/* 6. Third-Party Services */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            6. Third-Party Services
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            The Extension uses Google&apos;s Gemini 2.5 Flash API for AI
            processing. When content is sent to Google:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>We send only the minimum necessary content for processing</li>
            <li>No personal identifiers or metadata are included</li>
            <li>All transmissions use encrypted HTTPS connections</li>
            <li>
              We have no control over Google&apos;s data handling practices
            </li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            We encourage you to review Google&apos;s Privacy Policy to
            understand how they handle data received through their API.
          </p>
        </section>

        {/* 7. Browser Permissions */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            7. Browser Permissions
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            The Extension requires certain browser permissions to function:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>
              <strong>Active Tab Access:</strong> To read visible content for
              context analysis
            </li>
            <li>
              <strong>Storage Permission:</strong> For temporary session storage
            </li>
            <li>
              <strong>Optional Microphone Access:</strong> For voice input
              functionality
            </li>
          </ul>
          <p className="text-gray-300 leading-relaxed mt-3">
            These permissions are used exclusively for their stated purposes and
            are not used to collect or transmit personal data.
          </p>
        </section>

        {/* 8. Data Security */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            8. Data Security
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            Our security approach is based on data minimization:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>
              We don&apos;t collect data, so there&apos;s nothing to secure on
              our end
            </li>
            <li>
              All AI processing occurs through encrypted HTTPS connections
            </li>
            <li>
              Session data remains within your browser&apos;s secure environment
            </li>
            <li>No sensitive information is transmitted or stored</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            Since we have no user databases or servers storing personal
            information, there are no targets for data breaches.
          </p>
        </section>

        {/* 9. Your Rights and Controls */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            9. Your Rights and Controls
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            You maintain complete control over your data:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>
              Close the browser tab to immediately delete all session data
            </li>
            <li>Disable the Extension or microphone access at any time</li>
            <li>Use browser incognito/private mode for additional privacy</li>
            <li>Clear browser session storage through browser settings</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            Since we don&apos;t collect personal data, traditional data subject
            rights (access, deletion, portability) do not apply as there is no
            data to access, delete, or port.
          </p>
        </section>

        {/* 10. Children's Privacy */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            10. Children&apos;s Privacy
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Our Extension does not address anyone under the age of 13. We do not
            knowingly collect personal information from children. Since we
            collect no personal information from any users, our service is
            inherently compliant with children&apos;s privacy regulations.
          </p>
        </section>

        {/* 11. Changes to This Policy */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            11. Changes to This Policy
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the effective date.
          </p>
          <p className="text-gray-300 leading-relaxed">
            You are advised to review this Privacy Policy periodically for any
            changes. Changes to this Privacy Policy are effective when they are
            posted on this page.
          </p>
        </section>

        {/* 12. Contact Us */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            12. Contact Us
          </h2>
          <p className="text-gray-300 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact
            us through our website.
          </p>
          <p className="text-gray-300 leading-relaxed mt-3 italic">
            Our privacy promise: No data collection means no privacy risks. Your
            browsing remains your business.
          </p>
        </section>
      </div>
    </main>
  );
}
