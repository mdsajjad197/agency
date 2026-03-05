
"use client";

import * as React from "react";
import { useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Calendar, Mail, MapPin, Loader2, CheckCircle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Contact() {
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const [formData, setFormData] = React.useState({
    clientName: "",
    clientEmail: "",
    whatsappNumber: "",
    serviceRequired: "E-commerce Development",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "inquiries"), {
        ...formData,
        status: "new",
        createdAt: new Date().toISOString()
      });
      
      setSubmitted(true);
      toast({
        title: "Inquiry Sent!",
        description: "We'll get back to you within 24 hours.",
      });
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const agencyWhatsApp = process.env.NEXT_PUBLIC_AGENCY_WHATSAPP || "7845922005";
  const agencyEmail = "sajjadsaffan634@gmail.com";

  if (submitted) {
    return (
      <section className="py-24 bg-secondary/10 flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-6 max-w-md p-8 bg-white rounded-3xl shadow-xl">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-headline font-bold">Message Received</h3>
          <p className="text-muted-foreground">Thank you for reaching out, {formData.clientName}! Sajjad and the team will review your project brief shortly.</p>
          <Button variant="outline" onClick={() => setSubmitted(false)} className="rounded-full">Send another message</Button>
        </div>
      </section>
    );
  }

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
                  <p className="font-medium text-lg">{agencyEmail}</p>
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
                <a href={`https://wa.me/${agencyWhatsApp.replace(/[^0-9]/g, '')}`} target="_blank">
                  <div className="w-10 h-10 bg-[#25D366]/10 text-[#25D366] rounded-lg flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  WhatsApp
                </a>
              </Button>
              <Button variant="outline" className="h-20 rounded-2xl border-none shadow-sm hover:shadow-md bg-white text-lg justify-start gap-4 px-6 group" asChild>
                <a href="/booking">
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
                    <Input 
                      placeholder="John Doe" 
                      required 
                      className="bg-secondary/20 border-none h-12"
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      required 
                      className="bg-secondary/20 border-none h-12"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">WhatsApp Number</label>
                  <div className="relative">
                    <Input 
                      placeholder="+91 78459 22005" 
                      className="bg-secondary/20 border-none h-12 pl-10"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                    />
                    <Phone className="w-4 h-4 absolute left-3 top-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Service Required</label>
                  <select 
                    className="w-full h-12 rounded-md bg-secondary/20 border-none px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={formData.serviceRequired}
                    onChange={(e) => setFormData({...formData, serviceRequired: e.target.value})}
                  >
                    <option>E-commerce Development</option>
                    <option>Landing Page</option>
                    <option>Static Business Website</option>
                    <option>UI/UX Design</option>
                    <option>Other / Custom</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</label>
                  <Textarea 
                    placeholder="Tell us more about your project goals..." 
                    required 
                    className="bg-secondary/20 border-none min-h-[120px]"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <Button type="submit" className="w-full h-14 text-lg rounded-xl" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
