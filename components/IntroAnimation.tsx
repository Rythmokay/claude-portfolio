"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const statusSteps = [
  "Pondering architecture",
  "Synthesizing components",
  "Ready",
];

export function IntroAnimation({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"intro" | "done">("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const finish = useCallback(() => {
    setPhase("done");
  }, []);

  useEffect(() => {
    if (phase !== "intro") return;

    const t1 = setTimeout(() => setStepIndex(1), 900);
    const t2 = setTimeout(() => setStepIndex(2), 1900);
    const t3 = setTimeout(finish, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase, finish]);

  // Real-time chroma-keying of video to transparent canvas
  useEffect(() => {
    if (phase !== "intro") return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animId: number;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const processFrame = () => {
      if (video.readyState >= 2 && !video.paused) {
        const w = canvas.width;
        const h = canvas.height;

        // Crop centered square from 16:9 video
        const vw = video.videoWidth || 1280;
        const vh = video.videoHeight || 720;
        const size = Math.min(vw, vh);
        const sx = (vw - size) / 2;
        const sy = (vh - size) / 2;

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(video, sx, sy, size, size, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Background in loading.mp4 is ~#EAE6E1 (234, 230, 225)
          const bgDist = Math.hypot(r - 234, g - 230, b - 225);

          if (bgDist < 22) {
            data[i + 3] = 0; // Pure background -> 100% transparent
          } else if (bgDist < 55) {
            // Anti-aliased edge: smooth alpha and color to Claude terracotta
            const alpha = (bgDist - 22) / 33;
            data[i] = 217;
            data[i + 1] = 119;
            data[i + 2] = 87;
            data[i + 3] = Math.round(alpha * 255);
          }
        }

        ctx.putImageData(imgData, 0, 0);
      }
      animId = requestAnimationFrame(processFrame);
    };

    video.play().catch(() => {});
    animId = requestAnimationFrame(processFrame);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [phase]);

  return (
    <>
      {/* Hidden source video used for chroma-keying */}
      {phase === "intro" && (
        <video
          ref={videoRef}
          src="/loading.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="hidden"
        />
      )}

      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg select-none"
          >
            {/* Transparent Canvas with Pure Logo (No background disk) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex items-center justify-center"
            >
              <canvas
                ref={canvasRef}
                width={240}
                height={240}
                className="h-44 w-44 sm:h-56 sm:w-56"
              />
            </motion.div>

            {/* Brand Title / Identity */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
              className="relative z-10 mt-6 text-center"
            >
              <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-ink">
                Rythm Jagga
              </h2>
            </motion.div>

            {/* Clean Claude terminal-style thought steps (Zero Emojis) */}
            <div className="relative z-10 mt-3 h-5 w-full max-w-xs overflow-hidden px-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={stepIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="flex items-center justify-center text-center text-[13px] tracking-wide text-muted"
                >
                  <span>{statusSteps[stepIndex]}</span>
                  <motion.span
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="ml-0.5"
                  >
                    …
                  </motion.span>
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Claude-style delicate linear progress bar */}
            <div className="relative z-10 mt-6 w-32 sm:w-40">
              <div className="h-[1.5px] w-full rounded-full bg-line" />
              <motion.div
                className="absolute left-0 top-0 h-[1.5px] rounded-full bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 2.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>

            {/* Skip button */}
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.35 }}
              onClick={finish}
              className="relative z-10 mt-8 text-[11px] font-medium tracking-[0.2em] uppercase text-muted hover:text-ink transition-colors"
            >
              Skip
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


