import { Reveal } from "./Reveal";

export function SectionHeading({
  number,
  label,
  title,
  intro,
}: {
  number: string;
  label: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <Reveal className="mb-8 max-w-2xl lg:mb-10">
      <p className="eyebrow mb-3 flex items-center gap-3">
        <span className="text-accent-strong">{number}</span>
        <span className="h-px w-8 bg-line" />
        <span>{label}</span>
      </p>
      <h2 className="text-4xl leading-[1.1] tracking-tight sm:text-5xl">
        {title}
      </h2>
      {intro && (
        // Only shown when the screen is tall enough, so sections never overflow
        <p className="heading-intro mt-4 text-lg leading-relaxed text-muted">
          {intro}
        </p>
      )}
    </Reveal>
  );
}
