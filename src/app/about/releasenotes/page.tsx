import React from "react";
import { GridPatternCard, GridPatternCardBody } from "../GridCard";

const page = () => {
  return (
    <main className="min-h-screen mx-auto max-w-4xl text-gray-300 p-8 my-30 mx-auto">
      <h1 className="lg:text-5xl text-4xl font-bold text-start mb-6">
        RELEASE NOTES
      </h1>
      <div className="my-5">
        <GridPatternCard>
          <GridPatternCardBody>
            <h3 className="text-lg font-bold mb-1 text-foreground">
              WatchWing AI – Natural Conversations Evolved
            </h3>
            <p className="text-sm text-gray-400 mb-1">Version 1.2.0</p>
            <p className="text-xs text-gray-500 mb-3">1 October 2025</p>

            <div className="text-wrap text-sm text-foreground/60 space-y-3">
              <p>
                This update makes chatting with WatchWing AI feel more natural
                and convenient than ever before.
              </p>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  What&apos;s New:
                </h4>
                <ul className="space-y-1 ml-4">
                  <li>
                    • <strong>Natural Talking</strong> - AI now responds like a
                    real person, not just a screen analyzer
                  </li>
                  <li>
                    • <strong>Movable Window</strong> - Drag the chat window
                    anywhere on your screen
                  </li>
                  <li>
                    • <strong>Saves Your Chats</strong> - Your conversations are
                    now automatically saved
                  </li>
                  <li>
                    • <strong>Continue Where You Left</strong> - Pick up right
                    where you stopped last time
                  </li>
                  <li>
                    • <strong>New copy feature</strong> - Easily copy all ai
                    responses with one click
                  </li>
                </ul>
              </div>
            </div>
          </GridPatternCardBody>
        </GridPatternCard>
      </div>
      <div className="my-5">
        <GridPatternCard>
          <GridPatternCardBody>
            <h3 className="text-lg font-bold mb-1 text-foreground">
              WatchWing AI – Step to Future (Conversation Flow Update)
            </h3>
            <p className="text-sm text-gray-400 mb-1">Version 1.1.0</p>
            <p className="text-xs text-gray-500 mb-3">28 September 2025</p>

            <div className="text-wrap text-sm text-foreground/60 space-y-3">
              <p>
                The Conversation Flow Update transforms WatchWing AI from a
                simple screen analyzer to an intelligent conversational
                assistant that remembers your context while analyzing your
                screen.
              </p>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  Key Improvements:
                </h4>
                <ul className="space-y-1 ml-4">
                  <li>
                    • <strong>Conversation Memory</strong> - AI now remembers
                    your chat context while the window is open
                  </li>
                  <li>
                    • <strong>Self-Capture Fix</strong> - AI no longer sees
                    itself in screenshots during analysis
                  </li>
                  <li>
                    • <strong>Enhanced Loading States</strong> - Progressive
                    loading messages show each step of the process
                  </li>
                  <li>
                    • <strong>Clean Response Formatting</strong> - Removed HTML
                    tags and improved text display
                  </li>
                  <li>
                    • <strong>Chat Bubble Design</strong> - User messages now
                    appear in beautiful blue gradient bubbles
                  </li>
                  <li>
                    • <strong>Smart Scroll Behavior</strong> - Automatically
                    scrolls to show the start of new responses
                  </li>
                  <li>
                    • <strong>Markdown Support</strong> - Proper formatting for
                    bold, italic, lists, and code blocks
                  </li>
                </ul>
              </div>
            </div>
          </GridPatternCardBody>
        </GridPatternCard>
      </div>
      <GridPatternCard>
        <GridPatternCardBody>
          <h3 className="text-lg font-bold mb-1 text-foreground">
            WatchWing AI – The First Step
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
