"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Hero() {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-bg");

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-[#fcfcfc]">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 space-y-10 relative z-10 animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-headline font-bold leading-[0.95] tracking-tight text-foreground">
            Building the <br />
            <span className="text-primary italic">unforgettable.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed font-medium">
            SS Studio partners with ambitious brands to forge high-performance digital experiences that lead the market.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Button size="lg" className="w-full sm:w-auto rounded-full text-lg h-16 px-10 group bg-primary shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all" asChild>
              <Link href="#contact">
                Start My Project
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-10 pt-6 border-t border-border/40">
            <div className="space-y-1">
              <p className="text-2xl font-headline font-bold">10+</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Live Deployments</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-headline font-bold">3.5/5</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Client Rating</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-headline font-bold">90%</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Uptime Promise</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-1000 ring-1 ring-black/5">
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
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent" />
          </div>
          
          {/* Floating badge */}
          <div className="absolute -bottom-6 -left-12 p-8 bg-white rounded-3xl shadow-2xl border border-border/50 max-w-xs animate-bounce-slow hidden xl:block">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-[10px] font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Join 200+ Partners</span>
            </div>
            <p className="font-headline font-bold text-lg leading-tight">Elevate your brand beyond the noise.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
