"use client";

import * as React from "react";
import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------- Types -------------------- */
interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface ScrollFAQAccordionProps {
  data?: FAQItem[];
  className?: string;
  questionClassName?: string;
  answerClassName?: string;
}

/* -------------------- Default Data -------------------- */
const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 1,
    question: "What is Watchwing AI?",
    answer:
      "Watchwing AI is a Chrome extension that automatically summarizes YouTube videos using AI. It extracts key points and generates concise summaries so you can understand video content quickly.",
  },
  {
    id: 2,
    question: "How does it work?",
    answer:
      "When you visit any website with video content (YouTube, educational platforms, course websites, etc.), the extension analyzes the transcript/captions using AI and displays a summary. It identifies main topics, important segments, and key takeaways automatically.",
  },
  {
    id: 3,
    question: "Is it free?",
    answer: "Yes, it is free for now.",
  },
  {
    id: 4,
    question: "Does it work on all YouTube videos?",
    answer:
      "It works on most YouTube videos that have captions or transcripts available. Videos without captions may have limited functionality as we rely on caption data for accurate summaries.",
  },
  {
    id: 5,
    question: "Is my data private?",
    answer:
      "Absolutely. We don't track your browsing history or personal data. We only process the specific videos you summarize, and we never share your information with third parties.",
  },
];

export default function ScrollFAQAccordion({
  data,
  className,
  questionClassName,
  answerClassName,
}: ScrollFAQAccordionProps) {
  const faqData = data && data.length ? data : DEFAULT_FAQS;
  const [openItem, setOpenItem] = React.useState<string>(
    faqData[0]?.id.toString() || "1",
  );

  /* -------------------- Handle Click -------------------- */
  const handleItemClick = (itemId: string) => {
    setOpenItem(openItem === itemId ? "" : itemId);
  };

  /* -------------------- Render -------------------- */
  return (
    <section
      className={cn(
        "relative min-h-screen flex items-center justify-center px-4 sm:px-6",
        className,
      )}
    >
      {/* CENTERED CONTENT */}
      <div className="w-full max-w-3xl text-center">
        <h2 className="text-3xl sm:text-4xl text-white font-bold mb-3 lg:mt-15 mt-20">
          Frequently Asked Questions
        </h2>

        <p className="text-white mb-10 text-sm sm:text-base">
          Find answers to common questions about watchwing ai.
        </p>

        <Accordion.Root
          type="single"
          collapsible
          value={openItem}
          onValueChange={setOpenItem}
          className="space-y-6"
        >
          {faqData.map((item) => (
            <div key={item.id}>
              <Accordion.Item value={item.id.toString()}>
                <Accordion.Header>
                  <Accordion.Trigger
                    className="flex w-full items-center justify-between gap-4 cursor-pointer text-white"
                    onClick={() => handleItemClick(item.id.toString())}
                  >
                    <div
                      className={cn(
                        "rounded-xl px-4 py-3 bg-muted text-left text-sm sm:text-base flex-1 transition-all duration-300",
                        openItem === item.id.toString() &&
                          "bg-primary/20 text-primary",
                        questionClassName,
                      )}
                    >
                      {item.question}
                    </div>

                    <div className="flex-shrink-0 text-white">
                      {openItem === item.id.toString() ? (
                        <Minus className="h-5 w-5" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </div>
                  </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Content asChild forceMount>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={
                      openItem === item.id.toString()
                        ? { height: "auto", opacity: 1 }
                        : { height: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <div className="flex justify-end mt-4">
                      <div
                        className={cn(
                          "max-w-full sm:max-w-md rounded-2xl px-4 py-3 bg-blue-500 text-white text-sm sm:text-base",
                          answerClassName,
                        )}
                      >
                        {item.answer}
                      </div>
                    </div>
                  </motion.div>
                </Accordion.Content>
              </Accordion.Item>
            </div>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
