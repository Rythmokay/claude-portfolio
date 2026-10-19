"use client";

import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ClaudeSpark } from "./ClaudeSpark";
import { usePortfolio } from "@/lib/portfolio-provider";

// Bento spans on desktop: wide, narrow, narrow, wide — keeps a 2-row rhythm
const spans = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-4"];

// Hand-drawn style line glyphs, picked by keyword so CMS-renamed groups still match
function Glyph({ title }: { title: string }) {
  const t = title.toLowerCase();
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (t.includes("back") || t.includes("arch")) {
    // Stacked service layers
    return (
      <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden>
        <path {...common} d="M24 8 40 16 24 24 8 16Z" />
        <path {...common} d="M8 24l16 8 16-8" />
        <path {...common} d="M8 32l16 8 16-8" />
        <circle cx="24" cy="16" r="2.2" fill="currentColor" />
      </svg>
    );
  }
  if (t.includes("front") || t.includes("web")) {
    // Browser window with layout blocks
    return (
      <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden>
        <rect {...common} x="6" y="9" width="36" height="30" rx="4" />
        <path {...common} d="M6 16h36" />
        <circle cx="10.5" cy="12.5" r="1" fill="currentColor" />
        <circle cx="14" cy="12.5" r="1" fill="currentColor" />
        <rect {...common} x="11" y="21" width="12" height="13" rx="1.5" />
        <path {...common} d="M27 22h10M27 27h10M27 32h6" />
      </svg>
    );
  }
  if (t.includes("mobile") || t.includes("android")) {
    // Phone with a composed card
    return (
      <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden>
        <rect {...common} x="14" y="5" width="20" height="38" rx="4" />
        <path {...common} d="M21 9h6" />
        <rect {...common} x="18" y="15" width="12" height="9" rx="1.5" />
        <path {...common} d="M18 29h12M18 33h8" />
        <circle cx="24" cy="39" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  if (t.includes("data") || t.includes("tool")) {
    // Database cylinder with a wrench-like tick
    return (
      <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden>
        <ellipse {...common} cx="22" cy="12" rx="13" ry="5" />
        <path {...common} d="M9 12v22c0 2.8 5.8 5 13 5s13-2.2 13-5V12" />
        <path {...common} d="M9 23c0 2.8 5.8 5 13 5s13-2.2 13-5" />
        <path {...common} d="M36 31l5 5M39 29l-2 4 4-2" />
      </svg>
    );
  }
  return <ClaudeSpark className="h-10 w-10" />;
}

export function Skills() {
  const { skills } = usePortfolio();
  const groups = skills || [];
  const allItems = groups.flatMap((g) => g.items);

  return (
    <section
      id="skills"
      className="screen paper-dots relative overflow-hidden border-t border-line bg-sunken/60"
    >
      {/* Oversized spark watermark drifting in the corner */}
      <ClaudeSpark className="spin-slow pointer-events-none absolute -right-24 -top-16 h-80 w-80 text-accent/[0.07]" />

      <div className="container-page relative">
        <SectionHeading
          number="03"
          label="Skillset"
          title={
            <>
              The <em className="text-accent-strong">tools</em> of the trade
            </>
          }
          intro="Technologies I reach for most often, and the crafts that tie them together."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {groups.map((group, i) => {
            return (
              <Reveal
                key={group.title}
                delay={i * 0.07}
                className={`h-full ${spans[i % spans.length]}`}
              >
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lift sm:p-6">
                  {/* Terracotta wash that blooms from the glyph on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-accent/0 blur-2xl transition-colors duration-500 group-hover:bg-accent/15"
                  />

                  <header className="relative flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-line bg-bg text-accent-strong transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                        <Glyph title={group.title} />
                      </span>
                      <div>
                        <p className="eyebrow !tracking-[0.18em]">
                          No. {String(i + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-1 text-xl italic leading-tight sm:text-2xl">
                          {group.title}
                        </h3>
                      </div>
                    </div>
                    <span className="shrink-0 font-serif text-sm text-muted">
                      <span className="text-2xl text-ink">{group.items.length}</span>{" "}
                      tools
                    </span>
                  </header>

                  <span aria-hidden className="relative my-4 block h-px w-full bg-line">
                    <span className="absolute inset-y-0 left-0 w-0 bg-accent transition-all duration-700 group-hover:w-full" />
                  </span>

                  <ul className="relative flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="chip cursor-default hover:border-accent/50 hover:bg-accent/10 hover:text-accent-strong"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Slow ticker of every tool, set like a typographic specimen */}
        {allItems.length > 0 && (
          <Reveal delay={0.3}>
            <div
              aria-hidden
              className="marquee-mask mt-6 overflow-hidden border-y border-line py-3"
            >
              <div className="marquee-track flex w-max items-center gap-6 font-serif text-lg italic text-muted">
                {[...allItems, ...allItems].map((item, i) => (
                  <span key={i} className="flex items-center gap-6 whitespace-nowrap">
                    {item}
                    <ClaudeSpark className="h-3.5 w-3.5 text-accent" />
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
