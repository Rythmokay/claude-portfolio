"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { usePortfolio } from "@/lib/portfolio-provider";

const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const ease = [0.22, 1, 0.36, 1] as const;

type Job = {
  period: string;
  role: string;
  company: string;
  summary: string;
  points: string[];
};

const isCurrent = (job: Job) => /present/i.test(job.period);
const pad = (n: number) => String(n).padStart(2, "0");

// Each line of a chapter "inks in" one after another when it becomes active
const line: Variants = {
  // Outgoing text clears quickly, before the incoming lines start, so they never overlap
  off: { opacity: 0, y: -6, transition: { duration: 0.14, ease: "easeIn" } },
  on: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease, delay: 0.16 + i * 0.05 },
  }),
};

const numeral: Variants = {
  off: { opacity: 0, x: -12, transition: { duration: 0.14, ease: "easeIn" } },
  on: { opacity: 1, x: 0, transition: { duration: 0.8, ease, delay: 0.16 } },
};

// Timeline dot; the current role gets a soft pulsing halo
function Dot({ active, current }: { active: boolean; current: boolean }) {
  return (
    <span className="relative flex h-3.5 w-3.5 items-center justify-center">
      {current && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/40" />
      )}
      <span
        className={`relative h-3.5 w-3.5 rounded-full border-2 transition-colors duration-500 ${
          active ? "border-accent-strong bg-accent" : "border-line bg-bg"
        }`}
      />
    </span>
  );
}

// Chapter text. `animated` drives the staggered ink-in on desktop; mobile renders it static.
function ChapterBody({
  job,
  index,
  active = true,
  animated = false,
}: {
  job: Job;
  index: number;
  active?: boolean;
  animated?: boolean;
}) {
  const state = active ? "on" : "off";
  const M = animated ? motion.div : "div";
  const lineProps = (i: number) =>
    animated ? { variants: line, custom: i, initial: false, animate: state } : {};

  return (
    <div className="relative">
      {/* Outlined Roman numeral watermark */}
      <motion.span
        aria-hidden
        variants={animated ? numeral : undefined}
        initial={false}
        animate={animated ? state : undefined}
        className="numeral-outline pointer-events-none absolute -right-2 -top-6 select-none font-serif text-[8rem] leading-none sm:text-[10rem]"
      >
        {numerals[index]}
      </motion.span>

      <div className="relative">
        <M {...lineProps(0)} className="flex flex-wrap items-center gap-2.5">
          <span className="chip !border-accent/40 !bg-accent/10 !px-2.5 !py-0.5 !text-[12px] font-medium !text-accent-strong">
            Chapter {numerals[index]}
          </span>
          <span className="text-sm text-muted">{job.period}</span>
        </M>

        <M {...lineProps(1)}>
          <h3 className="mt-4 pr-16 text-2xl leading-tight tracking-tight sm:text-3xl">
            {job.role}
          </h3>
          <p className="mt-1 text-lg italic text-accent-strong">{job.company}</p>
        </M>

        <M {...lineProps(2)}>
          <blockquote className="mt-5 border-l-2 border-accent pl-4 text-[15px] italic leading-relaxed text-muted sm:text-base">
            {job.summary}
          </blockquote>
        </M>

        <ol className="mt-6 space-y-3">
          {job.points.map((p, i) => (
            <M
              key={p}
              {...lineProps(3 + i)}
              className="flex gap-4 text-[15px] leading-relaxed text-ink/90"
            >
              <span className="w-6 shrink-0 pt-px font-serif text-sm italic text-accent-strong">
                {pad(i + 1)}
              </span>
              <span>{p}</span>
            </M>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function Experience() {
  const { experience } = usePortfolio();
  const jobs: Job[] = experience || [];
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  // Measure dot centres so the terracotta rail fills exactly to the active entry
  const listRef = useRef<HTMLOListElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [rail, setRail] = useState({ top: 0, height: 0, fill: 0 });

  const measure = useCallback(() => {
    const list = listRef.current;
    const dots = dotRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!list || dots.length === 0) return;
    const base = list.getBoundingClientRect().top;
    const centre = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.top - base + r.height / 2;
    };
    const first = centre(dots[0]);
    const last = centre(dots[dots.length - 1]);
    const target = dots[active] ? centre(dots[active]) : first;
    setRail({ top: first, height: last - first, fill: target - first });
  }, [active]);

  useLayoutEffect(() => {
    measure();
    const list = listRef.current;
    if (!list) return;
    // Re-measure when the list reflows (fonts loading, viewport resize, CMS edits)
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [measure, jobs.length]);

  const go = (i: number) => setActive((i + jobs.length) % jobs.length);

  // Hover intent: only switch once the pointer rests on an entry, so sweeping
  // across the list doesn't flicker through every chapter
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>();
  const hoverTo = (i: number) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActive(i), 120);
  };
  const cancelHover = () => clearTimeout(hoverTimer.current);
  useEffect(() => cancelHover, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    }
  };

  const spring = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 380, damping: 34 };

  return (
    <section id="experience" className="screen border-t border-line">
      <div className="container-page">
        <SectionHeading
          number="02"
          label="Experience"
          title={
            <>
              Where I&rsquo;ve <em className="text-accent-strong">worked</em>
            </>
          }
          intro="A brief table of contents for the last few years of my career."
        />

        {/* Desktop: table of contents on the left, reading pane on the right */}
        <div className="hidden gap-8 lg:grid lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-4">Contents</p>
            <ol
              ref={listRef}
              role="tablist"
              aria-orientation="vertical"
              aria-label="Career chapters"
              onKeyDown={onKeyDown}
              className="relative"
            >
              {/* Timeline rail, with a terracotta fill that glides to the active chapter */}
              <span
                aria-hidden
                className="absolute left-[6px] w-px bg-line"
                style={{ top: rail.top, height: rail.height }}
              />
              <motion.span
                aria-hidden
                className="absolute left-[6px] w-px origin-top bg-accent"
                style={{ top: rail.top }}
                initial={false}
                animate={{ height: rail.fill }}
                transition={spring}
              />

              {jobs.map((job, i) => {
                const on = i === active;
                return (
                  <li key={job.company} role="presentation">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={on}
                      tabIndex={on ? 0 : -1}
                      onClick={() => {
                        cancelHover();
                        setActive(i);
                      }}
                      onMouseEnter={() => hoverTo(i)}
                      onMouseLeave={cancelHover}
                      className="group relative flex w-full cursor-pointer items-start gap-5 py-2 text-left"
                    >
                      <span
                        ref={(el) => {
                          dotRefs.current[i] = el;
                        }}
                        className="mt-[1.15rem]"
                      >
                        <Dot active={i <= active} current={isCurrent(job)} />
                      </span>

                      <span className="relative flex-1 px-4 py-3">
                        {/* One shared highlight card that slides between entries */}
                        {on && (
                          <motion.span
                            layoutId="experience-highlight"
                            transition={spring}
                            className="absolute inset-0 rounded-xl border border-line bg-surface shadow-card"
                          />
                        )}
                        <span className="relative block">
                          <span className="flex items-baseline justify-between gap-3">
                            <span
                              className={`font-serif text-sm italic transition-colors duration-300 ${
                                on ? "text-accent-strong" : "text-muted"
                              }`}
                            >
                              {numerals[i]}.
                            </span>
                            <span className="text-xs text-muted">{job.period}</span>
                          </span>
                          <span
                            className={`mt-1 block text-lg leading-snug transition-colors duration-300 ${
                              on ? "text-ink" : "text-ink/70 group-hover:text-ink"
                            }`}
                          >
                            {job.role}
                          </span>
                          <span className="block text-[15px] italic text-muted">
                            {job.company}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <article
              role="tabpanel"
              aria-label={jobs[active]?.role}
              className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-8 shadow-card"
            >
              {/* All chapters share one grid cell, so the card keeps the tallest height and never jumps */}
              <div className="grid flex-1">
                {jobs.map((job, i) => (
                  <div
                    key={job.company}
                    aria-hidden={i !== active}
                    className={`[grid-area:1/1] ${
                      i === active ? "z-10" : `pointer-events-none ${reduce ? "invisible" : ""}`
                    }`}
                  >
                    <ChapterBody job={job} index={i} active={i === active} animated={!reduce} />
                  </div>
                ))}
              </div>

              {/* Page footer: progress + previous / next */}
              {jobs.length > 1 && (
                <footer className="relative mt-8 flex items-center justify-between border-t border-line pt-5">
                  <p className="font-serif text-sm text-muted">
                    <span className="text-lg text-ink">{pad(active + 1)}</span>
                    <span className="mx-1.5">/</span>
                    {pad(jobs.length)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => go(active - 1)}
                      aria-label="Previous chapter"
                      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent/50 hover:bg-accent/10 hover:text-accent-strong"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => go(active + 1)}
                      aria-label="Next chapter"
                      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent/50 hover:bg-accent/10 hover:text-accent-strong"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </footer>
              )}
            </article>
          </Reveal>
        </div>

        {/* Mobile / tablet: every chapter on a vertical timeline */}
        <ol className="relative space-y-6 lg:hidden">
          <span aria-hidden className="absolute bottom-4 left-[6px] top-4 w-px bg-line" />
          {jobs.map((job, i) => (
            <li key={job.company} className="relative flex gap-4">
              <span className="pt-8">
                <Dot active current={isCurrent(job)} />
              </span>
              <Reveal delay={i * 0.06} className="min-w-0 flex-1">
                <article className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-card">
                  <ChapterBody job={job} index={i} />
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
