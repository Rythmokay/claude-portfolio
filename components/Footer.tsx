"use client";

import { usePortfolio } from "@/lib/portfolio-provider";

export function Footer() {
  const { profile } = usePortfolio();
  return (
    <footer className="mt-8 w-full border-t border-line pt-5">
      <div className="container-page flex flex-col items-center justify-between gap-2 text-sm text-muted sm:flex-row">
        <p className="italic">
          &copy; {new Date().getFullYear()} {profile.name}. Set in Newsreader.
        </p>
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.pushState(null, "", "#home");
          }}
          className="hover:text-ink cursor-pointer bg-transparent border-0 p-0 text-sm text-muted"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
