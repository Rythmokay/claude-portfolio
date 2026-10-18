"use client";

import { useState } from "react";
import { Download, Github, Linkedin, Loader2, Mail, Send } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Footer } from "./Footer";
import { profile } from "@/lib/data";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");

    try {
      // Point this at your own backend endpoint.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="screen border-t border-line bg-sunken/60">
      {/* my-auto keeps the content centred while the footer stays pinned to the bottom */}
      <div className="container-page my-auto">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading
              number="05"
              label="Contact"
              title={
                <>
                  Let&rsquo;s write something{" "}
                  <em className="text-accent-strong">together</em>
                </>
              }
              intro="Have a project, a role or just a thought to share? Send a note and I'll reply within a couple of days."
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
              className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-7"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="eyebrow mb-2 block">Name</span>
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Jane Austen"
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
                    placeholder="jane@example.com"
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
                  placeholder="Tell me about your project…"
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
                <p
                  role="status"
                  aria-live="polite"
                  className={`text-[15px] italic ${
                    status === "error" ? "text-accent-strong" : "text-muted"
                  }`}
                >
                  {status === "sent" && "Thank you — your message is on its way."}
                  {status === "error" &&
                    "Something went wrong. Please try again or email me directly."}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>

      <Footer />
    </section>
  );
}
