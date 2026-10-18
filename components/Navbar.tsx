"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ClaudeSpark } from "./ClaudeSpark";
import { usePortfolio } from "@/lib/portfolio-provider";

const navItems = [
  { targetId: "about", href: "/#about", label: "About" },
  { targetId: "experience", href: "/#experience", label: "Experience" },
  { targetId: "skills", href: "/#skills", label: "Skills" },
  { targetId: "projects", href: "/#projects", label: "Projects" },
  { targetId: "", href: "/blog", label: "Blog" },
  { targetId: "contact", href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const { profile } = usePortfolio();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (targetId: string, href: string) => {
    try {
      sessionStorage.setItem("portfolio_intro_seen", "true");
      localStorage.setItem("portfolio_intro_seen", "true");
    } catch {}

    if (!targetId) {
      router.push(href);
      return;
    }

    if (pathname === "/") {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${targetId}`);
        return;
      }
    }
    router.push(`/#${targetId}`);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-line bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <button
          type="button"
          onClick={() => handleNav("home", "/#home")}
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-90 cursor-pointer text-left"
          aria-label="Home"
        >
          <ClaudeSpark className="h-6 w-6 text-accent sm:h-7 sm:w-7" />
          <span className="font-serif text-[19px] tracking-tight text-ink sm:text-[22px] font-normal">
            {profile.name}
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNav(item.targetId, item.href)}
              className="rounded-lg px-3 py-2 text-[15px] text-muted transition-colors hover:bg-sunken hover:text-ink cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface md:hidden cursor-pointer"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden md:hidden"
            aria-label="Mobile"
          >
            <div className="container-page flex flex-col gap-1 pb-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    handleNav(item.targetId, item.href);
                  }}
                  className="rounded-lg px-3 py-3 text-left text-lg hover:bg-sunken text-ink cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
