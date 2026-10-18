"use client";

import Image from "next/image";
import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import { Reveal } from "./Reveal";
import { usePortfolio } from "@/lib/portfolio-provider";

export function Hero() {
  const { profile } = usePortfolio();
  const photo = profile.avatar || "/profile.svg";
  return (
    <section id="home" className="screen">
      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:col-span-7 lg:text-left">
            <Reveal delay={0.04}>
              <p className="eyebrow mb-3 sm:mb-5">Portfolio · Vol. 01 · 2026</p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="text-[27px] leading-[1.12] tracking-tight sm:text-5xl lg:text-[clamp(2.75rem,7.4svh,4.5rem)]">
                Hello, I&rsquo;m {profile.name}, a{" "}
                <em className="text-accent-strong">developer</em> who writes
                software like prose.
              </h1>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:mt-6 sm:text-lg lg:mx-0 lg:text-xl">
                {profile.tagline}
              </p>
            </Reveal>

            {/* ---------- MOBILE ACTION BUTTONS (< lg) ---------- */}
            <div className="mt-6 flex flex-col gap-2.5 lg:hidden">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", "#projects");
                  }}
                  className="btn btn-primary justify-center px-2 text-xs sm:text-sm whitespace-nowrap cursor-pointer"
                >
                  Read my work <ArrowDown size={14} />
                </button>
                <a
                  href={profile.cv}
                  download="Rythm_CV.pdf"
                  className="btn btn-ghost justify-center px-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <Download size={14} /> Download CV
                </a>
              </div>
              <div className="mt-2 flex items-center justify-center gap-2.5">
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Email"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-muted transition-colors hover:bg-sunken hover:text-ink"
                >
                  <Mail size={18} strokeWidth={1.75} />
                </a>
                <a
                  href={profile.socials.github}
                  aria-label="GitHub"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-muted transition-colors hover:bg-sunken hover:text-ink"
                >
                  <Github size={18} strokeWidth={1.75} />
                </a>
                <a
                  href={profile.socials.linkedin}
                  aria-label="LinkedIn"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-muted transition-colors hover:bg-sunken hover:text-ink"
                >
                  <Linkedin size={18} strokeWidth={1.75} />
                </a>
              </div>
              <p className="mt-3 text-[13px] tracking-wide text-muted">
                Based in {profile.location}
              </p>
            </div>

            {/* ---------- DESKTOP ACTION BUTTONS (lg+) ---------- */}
            <Reveal delay={0.2} className="hidden lg:block">
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", "#projects");
                  }}
                  className="btn btn-primary cursor-pointer"
                >
                  Read my work <ArrowDown size={17} />
                </button>
                <a
                  href={profile.cv}
                  download="Rythm_CV.pdf"
                  className="btn btn-ghost"
                >
                  <Download size={17} /> Download CV
                </a>
                <div className="ml-1 flex items-center gap-1">
                  <a
                    href={`mailto:${profile.email}`}
                    aria-label="Email"
                    className="rounded-lg p-2.5 text-muted transition-colors hover:bg-sunken hover:text-ink"
                  >
                    <Mail size={20} strokeWidth={1.75} />
                  </a>
                  <a
                    href={profile.socials.github}
                    aria-label="GitHub"
                    className="rounded-lg p-2.5 text-muted transition-colors hover:bg-sunken hover:text-ink"
                  >
                    <Github size={20} strokeWidth={1.75} />
                  </a>
                  <a
                    href={profile.socials.linkedin}
                    aria-label="LinkedIn"
                    className="rounded-lg p-2.5 text-muted transition-colors hover:bg-sunken hover:text-ink"
                  >
                    <Linkedin size={20} strokeWidth={1.75} />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ---------- Portrait on Desktop (hidden on mobile) ---------- */}
          <div className="hidden lg:col-span-5 lg:block">
            <Reveal delay={0.18}>
              <figure className="mx-auto w-full max-w-[17rem] sm:max-w-xs lg:w-[calc(min(58svh,31rem)*0.8)] lg:max-w-none">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[999px] rounded-b-3xl border border-line bg-sunken shadow-card">
                  <Image
                    src={photo}
                    alt={`Portrait of ${profile.name}`}
                    fill
                    priority
                    unoptimized={photo.endsWith(".svg")}
                    sizes="(min-width: 1024px) 30vw, 70vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 flex justify-between text-sm italic text-muted">
                  <span>Fig. 1 — The author</span>
                  <span>{profile.location}</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}



