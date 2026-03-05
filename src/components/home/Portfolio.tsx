
"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { ExternalLink, ArrowUpRight, Briefcase } from "lucide-react";
import Link from "next/link";

const categories = ["All", "E-commerce", "AI & EdTech", "Marketplace", "Landing Page"];

export function Portfolio() {
  const db = useFirestore();
  const [activeTab, setActiveTab] = React.useState("All");

  const projectsQuery = useMemoFirebase(() => {
    return query(collection(db, "portfolio_projects"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: projects, isLoading } = useCollection(projectsQuery);

  const filteredProjects = projects?.filter(
    (p) => activeTab === "All" || p.category === activeTab
  ) || [];

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

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[16/10] bg-secondary/20 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-12">
            {filteredProjects.map((project, idx) => (
              <div key={project.id} className="group relative space-y-6">
                <a 
                  href={project.projectUrl || "#"} 
                  target={project.projectUrl ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="block relative overflow-hidden rounded-[2.5rem] bg-secondary/20 aspect-[16/10] shadow-xl group-hover:shadow-2xl transition-all duration-500"
                >
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="rounded-full h-16 w-16 bg-white text-black flex items-center justify-center shadow-lg">
                      <ArrowUpRight className="w-8 h-8" />
                    </div>
                  </div>
                </a>
                
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
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-4 pt-2">
                      {project.tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center bg-secondary/10 rounded-3xl">
            <Briefcase className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="text-2xl font-headline font-bold">No projects found in this category.</h2>
            <p className="text-muted-foreground mt-2">Check back soon for new case studies.</p>
          </div>
        )}

        <div className="mt-20 text-center">
          <Button variant="outline" size="lg" className="rounded-full h-14 px-10 border-2 group" asChild>
            <Link href="#contact" className="flex items-center">
              Request a Similar Project
              <ExternalLink className="ml-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
