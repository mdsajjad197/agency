
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Hero() {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-bg");

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            Next-Gen Digital Solutions
          </div>
          
          <h1 className="text-5xl md:text-7xl font-headline font-bold leading-[1.1] text-foreground">
            Forging <span className="text-primary">Exceptional</span> Digital Presence.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
            SS Studio transforms vague ideas into high-performance, smooth-animated websites that captivate and convert.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" className="w-full sm:w-auto rounded-full text-lg h-14 px-8 group" asChild>
              <Link href="#contact">
                Start a Project
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full text-lg h-14 px-8" asChild>
              <Link href="#portfolio">View Portfolio</Link>
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-4 grayscale opacity-60">
            <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Trusted by:</div>
            <div className="flex gap-4 items-center">
              <span className="font-headline font-bold">STARTUPS</span>
              <span className="font-headline font-bold">RETAIL</span>
              <span className="font-headline font-bold">TECH</span>
            </div>
          </div>
        </div>

        <div className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-1000">
          {heroImg && (
            <Image
              src={heroImg.imageUrl}
              alt={heroImg.description}
              fill
              className="object-cover"
              data-ai-hint={heroImg.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          <div className="absolute bottom-8 left-8 p-6 bg-background/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl max-w-xs hidden sm:block">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-tight">Live Project Counter</span>
            </div>
            <p className="text-2xl font-headline font-bold">12 Active Builds</p>
            <p className="text-sm text-muted-foreground">Delivering excellence every single day.</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
}
