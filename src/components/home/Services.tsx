
"use client";

import { ShoppingCart, Layout, Code, Monitor, Zap, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const services = [
  {
    title: "E-commerce Development",
    description: "Full-featured online stores optimized for conversion and seamless user experience.",
    icon: ShoppingCart,
    imageId: "service-ecommerce"
  },
  {
    title: "Landing Pages",
    description: "High-impact single-page websites designed specifically to capture leads and drive action.",
    icon: Layout,
    imageId: "service-landing"
  },
  {
    title: "Static Business Sites",
    description: "Professional, fast-loading, and SEO-optimized websites for modern businesses.",
    icon: Code,
    imageId: "service-static"
  },
  {
    title: "UI/UX Design",
    description: "Intuitive and beautiful user interfaces crafted with a focus on usability and brand identity.",
    icon: Palette,
    imageId: "service-uiux"
  },
  {
    title: "Smooth Animations",
    description: "Adding life to your digital products with fluid transitions and interactive micro-interactions.",
    icon: Zap,
    imageId: "service-animation"
  },
  {
    title: "Responsive Design",
    description: "Websites that look and perform perfectly on desktops, tablets, and smartphones alike.",
    icon: Monitor,
    imageId: "service-responsive"
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
          {services.map((service, idx) => {
            const serviceImg = PlaceHolderImages.find(img => img.id === service.imageId);
            
            return (
              <Card key={idx} className="border-none shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden bg-white rounded-3xl">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {serviceImg && (
                    <Image
                      src={serviceImg.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      data-ai-hint={serviceImg.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <service.icon className="w-6 h-6" />
                  </div>
                </div>
                <CardContent className="p-8 space-y-4">
                  <h4 className="text-2xl font-headline font-bold group-hover:text-primary transition-colors">{service.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
