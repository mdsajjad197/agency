
"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const categories = ["All", "E-commerce", "SaaS", "Corporate"];

const projects = [
  {
    title: "Lumina Gear",
    category: "E-commerce",
    image: PlaceHolderImages.find(i => i.id === "project-1"),
    tags: ["Shopify", "React", "UX Design"],
  },
  {
    title: "Flux CRM",
    category: "SaaS",
    image: PlaceHolderImages.find(i => i.id === "project-2"),
    tags: ["Dashboard", "UI Kit", "NextJS"],
  },
  {
    title: "Zenith Mobile",
    category: "SaaS",
    image: PlaceHolderImages.find(i => i.id === "project-3"),
    tags: ["App Design", "Interaction"],
  },
  {
    title: "Vortex Agency",
    category: "Corporate",
    image: PlaceHolderImages.find(i => i.id === "project-4"),
    tags: ["Branding", "Landing Page"],
  },
];

export function Portfolio() {
  const [activeTab, setActiveTab] = React.useState("All");

  const filteredProjects = projects.filter(
    (p) => activeTab === "All" || p.category === activeTab
  );

  return (
    <section id="portfolio" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Portfolio</h2>
            <h3 className="text-4xl md:text-5xl font-headline font-bold">Selected Works</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeTab === cat ? "default" : "outline"}
                className="rounded-full px-6"
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-3xl bg-secondary/20 aspect-[4/3]">
              {project.image && (
                <Image
                  src={project.image.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  data-ai-hint={project.image.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <div className="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Badge className="bg-accent text-accent-foreground border-none">
                    {project.category}
                  </Badge>
                  <h4 className="text-3xl font-headline font-bold text-white">
                    {project.title}
                  </h4>
                  <div className="flex gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-white/60 text-xs font-medium uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
