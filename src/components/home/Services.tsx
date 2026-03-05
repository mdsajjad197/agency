
import { ShoppingCart, Layout, Code, Monitor, Zap, Palette } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const services = [
  {
    title: "E-commerce Development",
    description: "Full-featured online stores optimized for conversion and seamless user experience.",
    icon: ShoppingCart,
  },
  {
    title: "Landing Pages",
    description: "High-impact single-page websites designed specifically to capture leads and drive action.",
    icon: Layout,
  },
  {
    title: "Static Business Sites",
    description: "Professional, fast-loading, and SEO-optimized websites for modern businesses.",
    icon: Code,
  },
  {
    title: "UI/UX Design",
    description: "Intuitive and beautiful user interfaces crafted with a focus on usability and brand identity.",
    icon: Palette,
  },
  {
    title: "Smooth Animations",
    description: "Adding life to your digital products with fluid transitions and interactive micro-interactions.",
    icon: Zap,
  },
  {
    title: "Responsive Design",
    description: "Websites that look and perform perfectly on desktops, tablets, and smartphones alike.",
    icon: Monitor,
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Capabilities</h2>
          <h3 className="text-4xl md:text-5xl font-headline font-bold">Our Creative Suite</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We offer a comprehensive range of services to help you build, launch, and grow your digital presence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <Card key={idx} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="p-8 space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <service.icon className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-headline">{service.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
