
import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discovery & Strategy",
    description: "We dive deep into your brand, goals, and audience to build a rock-solid project foundation.",
  },
  {
    number: "02",
    title: "Design & UX",
    description: "Creating premium visuals and intuitive user journeys that tell your brand's unique story.",
  },
  {
    number: "03",
    title: "Development",
    description: "Turning designs into pixel-perfect, lightning-fast code with smooth, fluid animations.",
  },
  {
    number: "04",
    title: "Launch & Support",
    description: "Deployment is just the beginning. We provide ongoing support to ensure long-term success.",
  },
];

export function Process() {
  return (
    <section id="process" className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">How we work</h2>
            <h3 className="text-4xl md:text-5xl font-headline font-bold leading-tight">
              A meticulously crafted <br /> creative journey.
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Transparency is key to trust. We've streamlined our workflow to ensure you're involved and informed at every critical milestone.
            </p>
            
            <div className="flex items-center gap-4 p-6 bg-accent/10 rounded-2xl border border-accent/20">
              <CheckCircle2 className="text-primary w-10 h-10 shrink-0" />
              <div>
                <p className="font-headline font-bold text-xl">On-Time Delivery</p>
                <p className="text-sm text-muted-foreground">We value your time as much as our craft.</p>
              </div>
            </div>
          </div>

          <div className="relative space-y-12">
            {/* Connecting line */}
            <div className="absolute left-[2.25rem] top-0 bottom-0 w-px bg-border hidden sm:block" />
            
            {steps.map((step, idx) => (
              <div key={idx} className="relative pl-0 sm:pl-20 group">
                <div className="hidden sm:flex absolute left-0 top-0 w-12 h-12 rounded-full bg-background border-2 border-primary items-center justify-center font-headline font-bold text-primary z-10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {step.number}
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-bold text-primary uppercase tracking-widest sm:hidden">Step {step.number}</span>
                  <h4 className="text-2xl font-headline font-bold">{step.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
