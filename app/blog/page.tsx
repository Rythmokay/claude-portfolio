import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { blogs } from "@/lib/data";

export const metadata = {
  title: "Writing — Rythm Jagga",
  description:
    "Essays and technical notes by Rythm Jagga on software craft, system architecture, and readable code.",
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col justify-between">
      <Navbar />

      <main className="container-page pt-32 pb-20 flex-1">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/#home"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={16} /> Back to portfolio
          </Link>
        </div>

        {/* Page Header */}
        <header className="border-b border-line pb-10 sm:pb-14">
          <p className="eyebrow mb-3">Writing · Vol. 01 · 2026</p>
          <h1 className="font-serif text-4xl sm:text-6xl tracking-tight leading-[1.08]">
            Essays & <em className="text-accent-strong">technical notes</em>
          </h1>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-muted leading-relaxed">
            Reflections on writing software like prose, system design, and the
            art of readable domain modeling.
          </p>
        </header>

        {/* Blog Posts List */}
        <div className="mt-12 divide-y divide-line">
          {blogs.map((post) => (
            <article
              key={post.slug}
              className="group py-10 first:pt-0 last:pb-0 transition-colors"
            >
              <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-8 items-baseline">
                {/* Metadata column */}
                <div className="lg:col-span-3 text-sm text-muted flex items-center lg:flex-col lg:items-start gap-3">
                  <span>{post.date}</span>
                </div>

                {/* Content column */}
                <div className="lg:col-span-9">
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-serif text-2xl sm:text-3xl tracking-tight leading-snug group-hover:text-accent-strong transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    <Link
                      href={`/blog/${post.slug}`}
                      aria-label={`Read ${post.title}`}
                      className="mt-1 text-muted group-hover:text-accent-strong group-hover:translate-x-1 transition-all"
                    >
                      <ArrowUpRight size={22} />
                    </Link>
                  </div>

                  <p className="mt-3 text-base text-muted/95 leading-relaxed font-normal max-w-3xl">
                    {post.subtitle}
                  </p>

                  <p className="mt-4 text-[15px] text-ink/80 leading-relaxed max-w-3xl">
                    {post.excerpt}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="chip !px-2.5 !py-0.5 !text-[12px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
