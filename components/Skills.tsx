"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Code2, Eye } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ClaudeSpark } from "./ClaudeSpark";
import { usePortfolio } from "@/lib/portfolio-provider";

type Group = { title: string; items: string[] };

type Exchange = {
  question: string;
  answer: string;
  group: number; // which category the artifact pane should show
  match?: string; // a specific tool the visitor asked about
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const list = (items: string[]) =>
  items.length < 2
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

function answerFor(group: Group): string {
  return `For ${group.title.toLowerCase()}, I reach for ${list(group.items)}. I've opened the full list in the panel.`;
}

// Turn a free-text question into a reply, using only the portfolio data
function ask(groups: Group[], raw: string): Exchange | null {
  const q = raw.trim().toLowerCase();
  if (!q) return null;

  for (let g = 0; g < groups.length; g++) {
    const item = groups[g].items.find((it) => {
      const name = it.toLowerCase();
      return q.includes(name) || (q.length > 2 && name.includes(q));
    });
    if (item) {
      const others = groups[g].items.filter((it) => it !== item).slice(0, 3);
      return {
        question: raw.trim(),
        answer: `Yes — ${item} is part of my ${groups[g].title.toLowerCase()} toolkit${
          others.length ? `, alongside ${list(others)}` : ""
        }.`,
        group: g,
        match: item,
      };
    }
  }

  const g = groups.findIndex((gr) => gr.title.toLowerCase().includes(q));
  if (g >= 0) return { question: raw.trim(), answer: answerFor(groups[g]), group: g };

  return {
    question: raw.trim(),
    answer:
      "That one isn't in my toolkit yet — but I pick things up quickly. Try asking about a tool like Kotlin, Spring Boot or Docker.",
    group: -1,
  };
}

// Syntax-coloured JSON view of a category, like an artifact's code tab
function CodeView({ group }: { group: Group }) {
  return (
    <pre className="overflow-x-auto font-mono text-[13px] leading-6">
      <span className="text-muted">{"{"}</span>
      {"\n  "}
      <span className="text-ink">&quot;category&quot;</span>
      <span className="text-muted">: </span>
      <span className="text-accent-strong">&quot;{group.title}&quot;</span>
      <span className="text-muted">,</span>
      {"\n  "}
      <span className="text-ink">&quot;tools&quot;</span>
      <span className="text-muted">: [</span>
      {group.items.map((it, i) => (
        <span key={it}>
          {"\n    "}
          <span className="text-accent-strong">&quot;{it}&quot;</span>
          {i < group.items.length - 1 && <span className="text-muted">,</span>}
        </span>
      ))}
      {"\n  "}
      <span className="text-muted">]</span>
      {"\n"}
      <span className="text-muted">{"}"}</span>
    </pre>
  );
}

export function Skills() {
  const { skills } = usePortfolio();
  const groups: Group[] = useMemo(() => skills || [], [skills]);
  const reduce = useReducedMotion();

  const [exchange, setExchange] = useState<Exchange | null>(null);
  const [panel, setPanel] = useState(0);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [shown, setShown] = useState(0); // words of the answer revealed so far

  const words = useMemo(() => exchange?.answer.split(" ") ?? [], [exchange]);
  const streaming = thinking || shown < words.length;

  // Brief "thinking" beat, then stream the answer word by word
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (!exchange) return;

    if (reduce) {
      setThinking(false);
      setShown(words.length);
      if (exchange.group >= 0) setPanel(exchange.group);
      return;
    }

    setThinking(true);
    setShown(0);
    timers.current.push(
      setTimeout(() => {
        setThinking(false);
        if (exchange.group >= 0) setPanel(exchange.group);
        words.forEach((_, i) =>
          timers.current.push(setTimeout(() => setShown(i + 1), i * 38))
        );
      }, 650)
    );
    return () => timers.current.forEach(clearTimeout);
  }, [exchange, words, reduce]);

  const pick = (g: number) =>
    setExchange({ question: `What do you use for ${groups[g].title.toLowerCase()}?`, answer: answerFor(groups[g]), group: g });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = ask(groups, draft);
    if (next) setExchange(next);
    setDraft("");
  };

  const current = groups[panel];

  return (
    <section id="skills" className="screen border-t border-line bg-sunken/60">
      <div className="container-page">
        <SectionHeading
          number="03"
          label="Skillset"
          title={
            <>
              Ask me about my <em className="text-accent-strong">stack</em>
            </>
          }
          intro="Pick a topic or type a tool — the answer comes straight from my toolkit."
        />

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lift">
            {/* Window chrome */}
            <div className="flex items-center justify-between gap-3 border-b border-line bg-bg/60 px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-2.5">
                <ClaudeSpark className="h-4 w-4 text-accent" />
                <span className="text-sm text-ink">My stack</span>
                <span className="hidden text-sm text-muted sm:inline">· a conversation</span>
              </div>
              <span className="text-xs text-muted">
                {groups.reduce((n, g) => n + g.items.length, 0)} tools · {groups.length} topics
              </span>
            </div>

            <div className="grid lg:grid-cols-12">
              {/* ---------------- Conversation ---------------- */}
              <div className="flex flex-col border-line p-4 sm:p-6 lg:col-span-7 lg:border-r">
                <div
                  className="h-[220px] overflow-y-auto pr-1 sm:h-[240px]"
                  aria-live="polite"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {!exchange ? (
                      <motion.div
                        key="greeting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        className="flex gap-3"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
                          <ClaudeSpark className="h-[18px] w-[18px] text-accent" />
                        </span>
                        <div className="text-[16px] leading-relaxed text-ink/90">
                          <p>
                            Hi! I&rsquo;m the part of this portfolio that knows what
                            I build with.
                          </p>
                          <p className="mt-2 text-muted">
                            Pick a topic below, or ask about any tool —{" "}
                            <em>&ldquo;do you use Docker?&rdquo;</em>
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={exchange.question + exchange.answer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        className="space-y-5"
                      >
                        {/* Visitor bubble, right-aligned like claude.ai */}
                        <motion.div
                          initial={reduce ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex justify-end"
                        >
                          <p className="max-w-[85%] rounded-2xl rounded-br-md bg-sunken px-4 py-2.5 text-[15px] text-ink">
                            {exchange.question}
                          </p>
                        </motion.div>

                        {/* Reply */}
                        <div className="flex gap-3">
                          <motion.span
                            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10"
                            animate={streaming && !reduce ? { rotate: 360 } : { rotate: 0 }}
                            transition={
                              streaming
                                ? { duration: 2.4, repeat: Infinity, ease: "linear" }
                                : { duration: 0.4 }
                            }
                          >
                            <ClaudeSpark className="h-[18px] w-[18px] text-accent" />
                          </motion.span>
                          <div className="min-w-0 flex-1 text-[16px] leading-relaxed text-ink/90">
                            {thinking ? (
                              <p className="italic text-muted">
                                Thinking
                                <span className="thinking-dots" />
                              </p>
                            ) : (
                              <p>
                                {words.slice(0, shown).join(" ")}
                                {shown < words.length && (
                                  <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-accent" />
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Starter prompts */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {groups.map((g, i) => (
                    <button
                      key={g.title}
                      type="button"
                      onClick={() => pick(i)}
                      disabled={streaming}
                      className={`cursor-pointer rounded-full border px-3 py-1.5 text-[13px] transition-colors disabled:cursor-default ${
                        exchange?.group === i
                          ? "border-accent/50 bg-accent/10 text-accent-strong"
                          : "border-line bg-bg text-ink/80 hover:border-accent/40 hover:text-accent-strong"
                      }`}
                    >
                      {g.title}
                    </button>
                  ))}
                </div>

                {/* Composer */}
                <form
                  onSubmit={submit}
                  className="mt-3 flex items-center gap-2 rounded-2xl border border-line bg-bg p-1.5 pl-4 shadow-card transition focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/20"
                >
                  <label htmlFor="stack-ask" className="sr-only">
                    Ask about a tool
                  </label>
                  <input
                    id="stack-ask"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Ask about a tool…"
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent py-2 text-[16px] text-ink outline-none placeholder:text-muted/70"
                  />
                  <button
                    type="submit"
                    aria-label="Ask"
                    disabled={!draft.trim() || streaming}
                    className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-accent-strong text-white transition hover:brightness-95 disabled:cursor-default disabled:opacity-40"
                  >
                    <ArrowUp size={17} />
                  </button>
                </form>
              </div>

              {/* ---------------- Artifact pane ---------------- */}
              <div className="flex flex-col border-t border-line bg-bg/40 lg:col-span-5 lg:border-t-0">
                <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 sm:px-5">
                  <p className="truncate font-mono text-[12px] text-muted">
                    {current ? `${slug(current.title)}.json` : "stack.json"}
                  </p>
                  <div className="flex rounded-lg border border-line bg-surface p-0.5 text-[12px]">
                    {(["preview", "code"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setView(v)}
                        aria-pressed={view === v}
                        className={`relative flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 capitalize transition-colors ${
                          view === v ? "text-ink" : "text-muted hover:text-ink"
                        }`}
                      >
                        {view === v && (
                          <motion.span
                            layoutId="skills-view"
                            className="absolute inset-0 rounded-md bg-sunken"
                            transition={{ type: "spring", stiffness: 400, damping: 34 }}
                          />
                        )}
                        <span className="relative flex items-center gap-1.5">
                          {v === "preview" ? <Eye size={13} /> : <Code2 size={13} />}
                          {v}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fixed height on mobile; on desktop the pane fills the row without adding to it,
                    so switching topics or views never shifts the layout */}
                <div className="relative h-[300px] lg:h-auto lg:flex-1">
                <div className="absolute inset-0 overflow-y-auto p-5 pb-12 sm:p-6 sm:pb-12">
                  <AnimatePresence mode="wait" initial={false}>
                    {current && (
                      <motion.div
                        key={`${panel}-${view}`}
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        transition={{ duration: 0.3 }}
                      >
                        {view === "code" ? (
                          <CodeView group={current} />
                        ) : (
                          <>
                            <p className="eyebrow">
                              Topic {String(panel + 1).padStart(2, "0")} of{" "}
                              {String(groups.length).padStart(2, "0")}
                            </p>
                            <h3 className="mt-2 text-2xl italic leading-tight">
                              {current.title}
                            </h3>
                            <ul className="mt-5 flex flex-wrap gap-2">
                              {current.items.map((it, i) => (
                                <motion.li
                                  key={it}
                                  initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
                                  className={`chip ${
                                    exchange?.match === it
                                      ? "!border-accent/60 !bg-accent/15 !text-accent-strong"
                                      : ""
                                  }`}
                                >
                                  {it}
                                </motion.li>
                              ))}
                            </ul>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                  {/* Topic dots */}
                  {groups.length > 1 && (
                    <div className="absolute inset-x-0 bottom-0 flex gap-1.5 bg-gradient-to-t from-surface via-surface/90 to-transparent px-5 pb-4 pt-6 sm:px-6">
                      {groups.map((g, i) => (
                        <button
                          key={g.title}
                          type="button"
                          aria-label={`Show ${g.title}`}
                          onClick={() => setPanel(i)}
                          className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                            i === panel ? "w-6 bg-accent" : "w-1.5 bg-line hover:bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
