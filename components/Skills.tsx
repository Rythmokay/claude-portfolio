import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { skillGroups } from "@/lib/data";

export function Skills() {
  return (
    <section id="skills" className="screen border-t border-line bg-sunken/60">
      <div className="container-page">
        <SectionHeading
          number="03"
          label="Skillset"
          title={
            <>
              The <em className="text-accent-strong">tools</em> of the trade
            </>
          }
          intro="Technologies I reach for most often, and the crafts that tie them together."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.07}>
              <div className="h-full rounded-2xl border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <h3 className="text-2xl italic">{group.title}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
