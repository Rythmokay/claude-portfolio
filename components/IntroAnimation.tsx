"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ClaudeLogo } from "./ClaudeLogo";

const words = [
  "Pondering...",
  "Cogitating...",
  "Noodling...",
  "Percolating...",
  "Ruminating...",
  "Synthesizing...",
  "Ready",
];

export function IntroAnimation({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"intro" | "done">("intro");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const finish = useCallback(() => {
    setPhase("done");
  }, []);

  useEffect(() => {
    if (phase !== "intro") return;

    const currentWord = words[wordIndex];
    if (!currentWord) {
      finish();
      return;
    }

    // If on the final word ("Ready") and fully typed, hold and finish
    if (wordIndex === words.length - 1 && charIndex === currentWord.length) {
      const timer = setTimeout(finish, 850);
      return () => clearTimeout(timer);
    }

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (charIndex < currentWord.length) {
        // Typing forward character by character
        timer = setTimeout(() => {
          setCharIndex((prev) => prev + 1);
        }, 36);
      } else {
        // Word fully typed, pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 550);
      }
    } else {
      if (charIndex > 0) {
        // Backspacing
        timer = setTimeout(() => {
          setCharIndex((prev) => prev - 1);
        }, 18);
      } else {
        // Fully erased, advance to next word
        timer = setTimeout(() => {
          setIsDeleting(false);
          setWordIndex((prev) => prev + 1);
        }, 110);
      }
    }

    return () => clearTimeout(timer);
  }, [phase, wordIndex, charIndex, isDeleting, finish]);

  const displayedText = words[wordIndex]
    ? words[wordIndex].substring(0, charIndex)
    : "";

  return (
    <>
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg select-none"
          >
            {/* Claude-style animated vector mark (infinite resolution, zero artifacts) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex items-center justify-center"
            >
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  rotate: {
                    duration: 6.5,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  scale: {
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="flex items-center justify-center"
              >
                <ClaudeLogo className="h-28 w-28 sm:h-36 sm:w-36 text-accent-strong transition-colors" />
              </motion.div>
            </motion.div>

            {/* Terminal typewriter status thinking effect (No line animation, zero emojis, no name) */}
            <div className="relative z-10 mt-8 flex h-7 items-center justify-center px-4">
              <p className="font-mono text-[14px] sm:text-[15px] tracking-wide text-muted flex items-center">
                <span>{displayedText}</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{
                    duration: 0.75,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="inline-block w-[2px] h-[15px] bg-accent ml-1 rounded-sm"
                />
              </p>
            </div>

            {/* Skip button at Bottom Right */}
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.35 }}
              onClick={finish}
              className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 flex items-center gap-1.5 text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-muted hover:text-ink transition-colors px-3 py-1.5 rounded-lg hover:bg-sunken/60"
            >
              <span>Skip</span>
              <ArrowRight size={13} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={phase === "done" ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
