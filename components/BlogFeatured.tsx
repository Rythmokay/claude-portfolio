import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { blogs } from "@/lib/data";

export function BlogFeatured() {
  const featured = blogs.find((b) => b.featured) || blogs[0];

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
              <p className="mt-3 text-base sm:text-lg text-muted/95 leading-relaxed font-normal">
                {featured.subtitle}
              </p>
            </div>

            {/* Excerpt */}
            <p className="mt-4 text-[15px] sm:text-base text-ink/80 leading-relaxed max-w-3xl">
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
          </article>
        </Reveal>
      </div>
    </section>
  );
}
