import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Share2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPortfolioData } from "@/lib/db";
import { blogs as fallbackBlogs, profile as fallbackProfile } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPortfolioData();
  const list = data.blogs?.length ? data.blogs : fallbackBlogs;
  const post = list.find((b: any) => b.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — Rythm Jagga`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPortfolioData();
  const list = data.blogs?.length ? data.blogs : fallbackBlogs;
  const post = list.find((b: any) => b.slug === slug);
  const profile = data.profile || fallbackProfile;

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col justify-between">
      <Navbar />

      <main className="container-page pt-32 pb-24 flex-1">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={16} /> All essays
          </Link>
          <Link
            href="/#home"
            className="text-sm text-muted hover:text-ink transition-colors"
          >
            Portfolio
          </Link>
        </div>

        {/* Article Container */}
        <article className="mx-auto max-w-3xl">
          {/* Header */}
          <header className="border-b border-line pb-10">
            {/* Tag chips & Date */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              {post.tags.map((tag: string) => (
                <span key={tag} className="chip !px-2.5 !py-0.5 !text-[12px]">
                  {tag}
                </span>
              ))}
              <span className="mx-1.5 text-line">·</span>
              <span>{post.date}</span>
            </div>

            {/* Title */}
            <h1 className="mt-6 font-serif text-3xl sm:text-5xl lg:text-[2.85rem] font-normal leading-[1.12] tracking-tight">
              {post.title}
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-lg sm:text-xl text-muted leading-relaxed font-normal">
              {post.subtitle}
            </p>

            {/* Author Byline */}
            <div className="mt-8 flex items-center gap-3.5 pt-6 border-t border-line/60">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-strong text-xl italic text-white shadow-sm">
                {profile.initial}
              </span>
              <div>
                <p className="text-sm font-medium tracking-tight text-ink">
                  {profile.name}
                </p>
                <p className="text-xs text-muted">
                  {profile.role} · {profile.location}
                </p>
              </div>
            </div>
          </header>

          {/* Featured Editorial Illustration */}
          {post.coverImage && (
            <figure className="my-10 overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-sunken/40">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
              {post.coverCaption && (
                <figcaption className="border-t border-line bg-sunken/40 px-5 py-3 text-xs italic text-muted tracking-wide flex items-center justify-between">
                  <span>{post.coverCaption}</span>
                  <span className="not-italic text-[11px] uppercase tracking-wider text-muted/80 font-mono">
                    Plate I
                  </span>
                </figcaption>
              )}
            </figure>
          )}

          {/* Article Body */}
          <div className="pt-2 space-y-8 text-lg sm:text-[19px] leading-[1.8] text-ink/90 font-serif">
            {/* Intro Paragraphs with Drop Cap */}
            {post.content.intro.map((p: string, idx: number) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? "first-letter:float-left first-letter:mr-3.5 first-letter:mt-1 first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-accent-strong"
                    : ""
                }
              >
                {p}
              </p>
            ))}

            {/* Sections */}
            {post.content.sections.map((section: any, sIdx: number) => (
              <section key={sIdx} className="space-y-6 pt-4">
                <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-ink font-normal pt-2">
                  {section.heading}
                </h2>

                {section.paragraphs.map((p: string, pIdx: number) => (
                  <p key={pIdx}>{p}</p>
                ))}

                {section.quote && (
                  <blockquote className="my-8 rounded-r-2xl border-l-4 border-accent bg-sunken/70 px-6 py-5 italic text-xl sm:text-2xl leading-snug text-ink/95">
                    &ldquo;{section.quote}&rdquo;
                  </blockquote>
                )}

                {section.code && (
                  <div className="my-6 overflow-hidden rounded-xl border border-line bg-surface shadow-card">
                    {section.code.caption && (
                      <div className="border-b border-line bg-sunken/60 px-4 py-2 text-xs text-muted tracking-wide flex items-center justify-between">
                        <span>{section.code.caption}</span>
                        <span className="uppercase text-[10px] tracking-wider font-mono">
                          {section.code.language}
                        </span>
                      </div>
                    )}
                    <pre className="overflow-x-auto p-4 text-[13.5px] font-mono leading-relaxed text-ink/90 bg-sunken/30">
                      <code>{section.code.snippet}</code>
                    </pre>
                  </div>
                )}
              </section>
            ))}

            {/* Conclusion */}
            <div className="mt-12 rounded-2xl border border-line bg-surface p-7 sm:p-8 space-y-3">
              <h3 className="font-serif text-xl sm:text-2xl tracking-tight text-ink">
                Final thoughts
              </h3>
              <p className="text-base sm:text-lg leading-relaxed text-muted">
                {post.content.conclusion}
              </p>
            </div>
          </div>

          {/* Article Footer */}
          <div className="mt-14 border-t border-line pt-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent-strong hover:underline underline-offset-4"
            >
              <ArrowLeft size={16} /> Back to all essays
            </Link>
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${profile.email}?subject=Reflections on: ${encodeURIComponent(post.title)}`}
                className="btn btn-ghost !py-2 !text-xs"
              >
                Share feedback via email
              </a>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
