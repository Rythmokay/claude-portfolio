"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Github,
  Linkedin,
  Loader2,
  Mail,
  Send,
  X,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Footer } from "./Footer";
import { usePortfolio } from "@/lib/portfolio-provider";

type Status = "idle" | "sending" | "sent" | "error";

type Toast = { kind: "sent" | "error"; name?: string; id: number };

// Pop-up confirmation shown after the form is submitted
function ContactToast({
  toast,
  email,
  onClose,
}: {
  toast: Toast | null;
  email: string;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();

  // Auto-dismiss; errors stay up a little longer so there's time to act on them
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, toast.kind === "sent" ? 5000 : 8000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex justify-center sm:inset-x-auto sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role={toast.kind === "error" ? "alert" : "status"}
            aria-live={toast.kind === "error" ? "assertive" : "polite"}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-surface shadow-lift"
          >
            <div className="flex gap-3 p-4 pr-11">
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  toast.kind === "sent"
                    ? "bg-accent/10 text-accent-strong"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {toast.kind === "sent" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              </span>
              <div className="min-w-0">
                <p className="text-[16px] leading-snug text-ink">
                  {toast.kind === "sent"
                    ? `Message sent${toast.name ? `, ${toast.name}` : ""}!`
                    : "Message not sent"}
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">
                  {toast.kind === "sent" ? (
                    "Thanks for reaching out — I'll get back to you shortly."
                  ) : (
                    <>
                      Something went wrong. Please try again, or email me at{" "}
                      <a href={`mailto:${email}`} className="text-accent-strong underline-offset-2 hover:underline">
                        {email}
                      </a>
                      .
                    </>
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss notification"
              className="absolute right-2.5 top-2.5 rounded-lg p-1.5 text-muted transition-colors hover:bg-sunken hover:text-ink"
            >
              <X size={15} />
            </button>
            {/* Countdown bar until auto-dismiss */}
            <motion.span
              aria-hidden
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: toast.kind === "sent" ? 5 : 8, ease: "linear" }}
              className={`absolute inset-x-0 bottom-0 h-0.5 origin-left ${
                toast.kind === "sent" ? "bg-accent" : "bg-red-500/70"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Contact() {
  const { profile } = usePortfolio();
  const [status, setStatus] = useState<Status>("idle");
  const [toast, setToast] = useState<Toast | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      const name = String(data.name ?? "").trim().split(/\s+/)[0];
      setToast({ kind: "sent", name, id: Date.now() });
      form.reset();
    } catch {
      setStatus("error");
      setToast({ kind: "error", id: Date.now() });
    }
  }

  return (
    <section id="contact" className="screen border-t border-line bg-sunken/60">
      {/* my-auto keeps the content centred while the footer stays pinned to the bottom */}
      <div className="container-page my-auto">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading
              number="06"
              label="Contact"
              title={
                <>
                  Let&rsquo;s build something{" "}
                  <em className="text-accent-strong">together</em>
                </>
              }
              intro="Have an engineering role, a project, or a technical inquiry? Send a note and I'll get back to you shortly."
            />
            <Reveal delay={0.1}>
              <div className="space-y-4 text-lg">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-3 hover:text-accent-strong"
                >
                  <Mail size={19} strokeWidth={1.75} /> {profile.email}
                </a>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={profile.cv}
                    download="Rythm_CV.pdf"
                    className="btn btn-ghost !py-2.5"
                  >
                    <Download size={17} /> Download CV
                  </a>
                  <a
                    href={profile.socials.github}
                    aria-label="GitHub"
                    className="rounded-lg p-2.5 text-muted hover:bg-surface hover:text-ink"
                  >
                    <Github size={20} strokeWidth={1.75} />
                  </a>
                  <a
                    href={profile.socials.linkedin}
                    aria-label="LinkedIn"
                    className="rounded-lg p-2.5 text-muted hover:bg-surface hover:text-ink"
                  >
                    <Linkedin size={20} strokeWidth={1.75} />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="relative space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-7"
            >
              {/* Honeypot for bots — hidden from people and screen readers */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="eyebrow mb-2 block">Name</span>
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className="field"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow mb-2 block">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@company.com"
                    className="field"
                  />
                </label>
              </div>
              <label className="block">
                <span className="eyebrow mb-2 block">Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Your message..."
                  className="field resize-y"
                />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn btn-primary disabled:opacity-70"
                >
                  {status === "sending" ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Send size={17} />
                  )}
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>

      <Footer />
      <ContactToast toast={toast} email={profile.email} onClose={closeToast} />
    </section>
  );
}
