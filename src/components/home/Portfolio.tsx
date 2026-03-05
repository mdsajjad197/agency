
"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ExternalLink, ArrowUpRight } from "lucide-react";

const categories = ["All", "E-commerce", "AI & EdTech", "Marketplace"];

const projects = [
  {
    title: "MordenShop",
    category: "E-commerce",
    description: "A premium minimalist fashion experience focused on high-conversion and fluid animations.",
    image: PlaceHolderImages.find(i => i.id === "project-mordenshop"),
    tags: ["Next.js", "Tailwind", "Framer"],
  },
  {
    title: "AI Learn",
    category: "AI & EdTech",
    description: "Interactive learning platform utilizing generative AI to personalize student curricula.",
    image: PlaceHolderImages.find(i => i.id === "project-ailearn"),
    tags: ["AI Integration", "React", "Node.js"],
  },
  {
    title: "Farm Connect",
    category: "Marketplace",
    description: "Sustainability-focused platform connecting local farmers directly with urban consumers.",
    image: PlaceHolderImages.find(i => i.id === "project-farmconnect"),
    tags: ["Marketplace", "Maps API", "UI/UX"],
  },
  {
    title: "Fruit Shop",
    category: "E-commerce",
    description: "A vibrant, lightning-fast digital storefront for organic, farm-fresh produce.",
    image: PlaceHolderImages.find(i => i.id === "project-fruitshop"),
    tags: ["Performance", "Visual Design"],
  },
];

export function Portfolio() {
  const [activeTab, setActiveTab] = React.useState("All");

  const filteredProjects = projects.filter(
    (p) => activeTab === "All" || p.category === activeTab
  );

  return (
    <section id="portfolio" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
              Our Work
            </div>
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">
              Selected <span className="text-primary italic">Artifacts.</span>
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2 bg-secondary/20 p-1.5 rounded-2xl">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeTab === cat ? "default" : "ghost"}
                className="rounded-xl px-6 h-10 transition-all duration-300"
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {filteredProjects.map((project, idx) => (
            <div key={idx} className="group relative space-y-6">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-secondary/20 aspect-[16/10] shadow-xl group-hover:shadow-2xl transition-all duration-500">
                {project.image && (
                  <Image
                    src={project.image.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    data-ai-hint={project.image.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <Button className="rounded-full h-16 w-16 bg-white text-black hover:bg-white/90">
                    <ArrowUpRight className="w-8 h-8" />
                  </Button>
                </div>
              </div>
              
              <div className="px-2 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-3xl font-headline font-bold tracking-tight">
                    {project.title}
                  </h4>
                  <Badge variant="outline" className="rounded-full border-primary/20 text-primary">
                    {project.category}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {project.description}
                </p>
                <div className="flex gap-4 pt-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 border-b border-transparent hover:border-primary/40 hover:text-primary transition-all cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Button variant="outline" size="lg" className="rounded-full h-14 px-10 border-2 group">
            View Case Studies
            <ExternalLink className="ml-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
