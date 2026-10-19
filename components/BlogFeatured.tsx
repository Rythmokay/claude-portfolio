"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { usePortfolio } from "@/lib/portfolio-provider";

export function BlogFeatured() {
  const { blogs } = usePortfolio();
  const featured = (blogs || []).find((b) => b.featured) || (blogs || [])[0];

  if (!featured) return null;

  return (
    <section id="blog" className="screen border-t border-line">
      <div className="container-page">
        <SectionHeading
          number="05"
          label="Writing"
          title={
            <>
              Essays & <em className="text-accent-strong">technical notes</em>
            </>
          }
          intro="Thoughts on software craft, system architecture, and writing maintainable code that engineers enjoy reading."
        />

        <Reveal delay={0.1}>
          <article className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-9 shadow-card transition-all duration-300 hover:shadow-lift">
            <div className="flex flex-col gap-8">
              <div>
                {/* Top metadata row */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
                  <div className="flex items-center gap-2.5">
                    <span className="chip !border-accent/40 !bg-accent/10 !text-accent-strong font-medium !px-2.5 !py-0.5 !text-[12px]">
                      Featured Essay
                    </span>
                    <span>{featured.date}</span>
                  </div>
                </div>

                {/* Title & subtitle */}
                <div className="mt-5">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="group-hover:text-accent-strong transition-colors"
                  >
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-[1.2]">
                      {featured.title}
                    </h3>
                  </Link>
                  {/* Cover illustration — below the heading, above the text */}
                  {featured.coverImage && (
                    <div className="mt-6">
                      <Link
                        href={`/blog/${featured.slug}`}
                        className="block overflow-hidden rounded-xl border border-line bg-sunken/40 shadow-sm transition-all duration-300 group-hover:border-accent/40 group-hover:shadow-md"
                      >
                        <div className="relative aspect-[16/10] lg:aspect-[21/9] w-full overflow-hidden bg-sunken/40">
                          <Image
                            src={featured.coverImage}
                            alt={featured.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            sizes="(max-width: 1280px) 100vw, 1100px"
                          />
                        </div>
                        {featured.coverCaption && (
                          <div className="border-t border-line bg-sunken/60 px-3.5 py-2 text-[11px] italic text-muted">
                            {featured.coverCaption}
                          </div>
                        )}
                      </Link>
                    </div>
                  )}
                  <p className={`${featured.coverImage ? "mt-6" : "mt-3"} text-base sm:text-lg text-muted/95 leading-relaxed font-normal`}>
                    {featured.subtitle}
                  </p>
                </div>

                {/* Excerpt */}
                <p className="mt-4 text-[15px] sm:text-base text-ink/80 leading-relaxed">
                  {featured.excerpt}
                </p>

                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {featured.tags.map((t) => (
                    <span key={t} className="chip !px-2.5 !py-0.5 !text-[12px]">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="btn btn-primary !py-2.5 !text-[14px]"
                  >
                    <BookOpen size={15} /> Read full essay
                  </Link>
                  <Link
                    href="/blog"
                    className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink transition-colors"
                  >
                    <span>View all essays</span>
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover/link:translate-x-1"
                    />
                  </Link>
                </div>
              </div>

            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
