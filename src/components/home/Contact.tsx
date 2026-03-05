
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Calendar, Mail, MapPin, ExternalLink } from "lucide-react";

export function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    alert("Thanks! We've received your inquiry. (Lead stored in mock database)");
  };

  return (
    <section id="contact" className="py-24 bg-secondary/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Get in touch</h2>
              <h3 className="text-4xl md:text-5xl font-headline font-bold leading-tight">
                Let's build something <br /> legendary together.
              </h3>
              <p className="text-lg text-muted-foreground max-w-md">
                Whether you have a fully-fledged brief or just a spark of an idea, we're ready to listen and execute.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Email us</p>
                  <p className="font-medium text-lg">hello@ssstudio.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Our Studio</p>
                  <p className="font-medium text-lg">Remote-First, Global Delivery</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 rounded-2xl border-none shadow-sm hover:shadow-md bg-white text-lg justify-start gap-4 px-6 group" asChild>
                <a href="https://wa.me/yourwhatsappnumber" target="_blank">
                  <div className="w-10 h-10 bg-[#25D366]/10 text-[#25D366] rounded-lg flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  WhatsApp
                </a>
              </Button>
              <Button variant="outline" className="h-20 rounded-2xl border-none shadow-sm hover:shadow-md bg-white text-lg justify-start gap-4 px-6 group" asChild>
                <a href="https://calendly.com/yourlink" target="_blank">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                  Book Call
                </a>
              </Button>
            </div>
          </div>

          <Card className="rounded-3xl border-none shadow-2xl overflow-hidden bg-white">
            <CardContent className="p-10 space-y-8">
              <h4 className="text-2xl font-headline font-bold">Project Inquiry Form</h4>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                    <Input placeholder="John Doe" required className="bg-secondary/20 border-none h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                    <Input type="email" placeholder="john@example.com" required className="bg-secondary/20 border-none h-12" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Service Required</label>
                  <select className="w-full h-12 rounded-md bg-secondary/20 border-none px-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                    <option>E-commerce Development</option>
                    <option>Landing Page</option>
                    <option>Static Business Website</option>
                    <option>UI/UX Design</option>
                    <option>Other / Custom</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</label>
                  <Textarea placeholder="Tell us more about your project goals..." required className="bg-secondary/20 border-none min-h-[120px]" />
                </div>

                <Button type="submit" className="w-full h-14 text-lg rounded-xl">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
