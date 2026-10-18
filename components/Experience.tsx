"use client";

import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { usePortfolio } from "@/lib/portfolio-provider";

const numerals = ["I", "II", "III", "IV", "V", "VI"];

export function Experience() {
  const { experience } = usePortfolio();
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

        {/* Three journal-style columns on desktop so the whole career fits one screen */}
        <ol className="grid gap-10 lg:grid-cols-3 lg:gap-8">
          {experience.map((job, i) => (
            <li key={job.company}>
              <Reveal delay={i * 0.08} className="h-full">
                <article className="h-full border-t-2 border-ink/80 pt-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm italic text-accent-strong">
                      Chapter {numerals[i]}
                    </p>
                    <p className="text-sm text-muted">{job.period}</p>
                  </div>
                  <h3 className="mt-3 text-2xl leading-tight tracking-tight">
                    {job.role}
                  </h3>
                  <p className="text-lg italic text-muted">{job.company}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    {job.summary}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {job.points.map((p) => (
                      <li
                        key={p}
                        className="flex gap-3 text-[15px] leading-relaxed text-ink/90"
                      >
                        <span
                          aria-hidden
                          className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
