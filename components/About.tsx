"use client";

import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { usePortfolio } from "@/lib/portfolio-provider";

export function About() {
  const { profile } = usePortfolio();
  return (
    <section id="about" className="screen border-t border-line">
      <div className="container-page">
        <SectionHeading
          number="01"
          label="About"
          title={
            <>
              A short <em className="text-accent-strong">biography</em>
            </>
          }
          intro="Who I am, what I care about, and how I like to work."
        />

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <div className="space-y-4 text-lg leading-[1.75] text-ink/90">
              {profile.about.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-accent-strong"
                      : ""
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <div className="space-y-6 lg:col-span-5">
            <Reveal delay={0.08}>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl border border-line bg-surface p-6 shadow-card">
                <div>
                  <dt className="eyebrow">Based in</dt>
                  <dd className="mt-1 text-lg">{profile.location}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Focus</dt>
                  <dd className="mt-1 text-lg">{profile.role}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Currently</dt>
                  <dd className="mt-1 text-lg">{profile.currently}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Availability</dt>
                  <dd className="mt-1 text-lg">{profile.availability}</dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="grid grid-cols-3 gap-4">
                {profile.stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-4xl tracking-tight text-accent-strong sm:text-5xl">
                      {s.value}
                    </p>
                    <p className="mt-1 text-sm text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
