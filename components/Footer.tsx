import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-8 w-full border-t border-line pt-5">
      <div className="container-page flex flex-col items-center justify-between gap-2 text-sm text-muted sm:flex-row">
        <p className="italic">
          &copy; {new Date().getFullYear()} {profile.name}. Set in Newsreader.
        </p>
        <a href="#home" className="hover:text-ink">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
