import { ArrowUpRight, Github } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { projects } from "@/lib/data";

export function Projects() {
  return (
    <section id="projects" className="screen border-t border-line">
      <div className="container-page">
        <SectionHeading
          number="04"
          label="Selected work"
          title={
            <>
              Projects I&rsquo;m <em className="text-accent-strong">proud</em> of
            </>
          }
          intro="A few things I've designed, built and shipped, from side projects to production systems."
        />

        {/* 4 across on wide screens (one row = one screen), 2x2 on tablets */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <article className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-3 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                {/* Typographic cover */}
                <div className="relative flex h-32 items-end justify-between overflow-hidden rounded-xl bg-sunken p-4 xl:h-28">
                  <span
                    aria-hidden
                    className="absolute -right-2 -top-6 select-none text-[8rem] italic leading-none text-accent/25 transition-transform duration-500 group-hover:scale-110 xl:text-[7rem]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="eyebrow relative">No. {i + 1}</span>
                  <ArrowUpRight
                    className="relative text-muted transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent-strong"
                    size={20}
                  />
                </div>

                <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
                  <h3 className="text-2xl tracking-tight">{p.title}</h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">
                    {p.blurb}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="chip !px-2.5 !py-0.5 !text-[12px]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-4 border-t border-line pt-3 text-[15px]">
                    <a
                      href={p.live}
                      className="inline-flex items-center gap-1 font-medium text-accent-strong underline-offset-4 hover:underline"
                    >
                      Live <ArrowUpRight size={15} />
                    </a>
                    <a
                      href={p.repo}
                      className="inline-flex items-center gap-1.5 text-muted hover:text-ink"
                    >
                      <Github size={15} /> Source
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
