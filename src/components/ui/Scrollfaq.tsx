"use client";

import * as React from "react";
import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const [openItem, setOpenItem] = React.useState(faqData[0]?.id.toString());

  const outerRef = React.useRef<HTMLDivElement>(null);

  /* -------------------- GSAP Setup -------------------- */
  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useGSAP(() => {
    if (!outerRef.current) return;

    ScrollTrigger.getAll().forEach((t) => t.kill());

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: outerRef.current,
        start: "center center", // ✅ TRUE CENTER
        end: `+=${faqData.length * 160}`,
        scrub: 0.5,
        pin: true,
        anticipatePin: 1, // ✅ prevents jump
      },
    });

    faqData.forEach((item, index) => {
      tl.add(() => {
        setOpenItem(item.id.toString());
      }, index * 1);
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [faqData]);

  /* -------------------- Render -------------------- */
  return (
    <section
      ref={outerRef}
      className={cn(
        "relative min-h-screen flex items-center justify-center px-4 sm:px-6",
        className,
      )}
    >
      {/* CENTERED CONTENT */}
      <div className="w-full max-w-3xl text-center ">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 lg:mt-15 mt-20 ">
          Frequently Asked Questions
        </h2>

        <p className="text-muted-foreground mb-10 text-sm sm:text-base">
          Find answers to common questions about watchwing ai.
        </p>

        <Accordion.Root type="single" collapsible value={openItem}>
          {faqData.map((item) => (
            <Accordion.Item
              key={item.id}
              value={item.id.toString()}
              className="mb-6"
            >
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between gap-4">
                  <div
                    className={cn(
                      "rounded-xl px-4 py-3 bg-muted text-left text-sm sm:text-base",
                      openItem === item.id.toString() &&
                        "bg-primary/20 text-primary",
                      questionClassName,
                    )}
                  >
                    {item.question}
                  </div>

                  {openItem === item.id.toString() ? (
                    <Minus className="h-5 w-5 shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 shrink-0" />
                  )}
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
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
