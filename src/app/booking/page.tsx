
"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, Loader2, Phone, MessageSquare } from "lucide-react";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function BookingPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState<string>("10:00 AM");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", whatsapp: "" });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast({ title: "Select a date", description: "Please pick a date for your session.", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    const bookingData = {
      clientName: form.name,
      clientEmail: form.email,
      whatsappNumber: form.whatsapp,
      date: date.toISOString().split('T')[0],
      time: time,
      createdAt: new Date().toISOString()
    };

    addDoc(collection(db, "bookings"), bookingData)
      .then(() => {
        setSuccess(true);
        setLoading(false);
      })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'bookings',
          operation: 'create',
          requestResourceData: bookingData,
        }));
        setLoading(false);
      });
  };

  const timeSlots = ["10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
  const agencyWhatsApp = process.env.NEXT_PUBLIC_AGENCY_WHATSAPP || "+923000000000";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-24 bg-secondary/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-5xl font-headline font-bold">Book a Strategy Session</h1>
            <p className="text-xl text-muted-foreground">Let's map out your project together. Secure your slot in minutes.</p>
          </div>

          {success ? (
            <Card className="border-none shadow-2xl rounded-3xl p-12 text-center space-y-6 bg-white">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-headline font-bold">Booking Confirmed!</h2>
              <p className="text-muted-foreground">Check your email for details. Sajjad is looking forward to meeting you on {date?.toLocaleDateString()} at {time}.</p>
              <Button size="lg" className="rounded-full" onClick={() => window.location.href = "/"}>Return Home</Button>
            </Card>
          ) : (
            <div className="space-y-8">
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2">
                    <div className="p-8 bg-primary/5 border-r">
                      <h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Pick Date & Time
                      </h3>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          if (newDate) {
                            setDate(newDate);
                          }
                        }}
                        className="rounded-md border bg-white mb-6"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map(t => (
                          <Button 
                            key={t}
                            variant={time === t ? "default" : "outline"}
                            className="text-xs h-10"
                            onClick={() => setTime(t)}
                          >
                            {t}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-8 space-y-8">
                      <h3 className="text-xl font-headline font-bold">Your Details</h3>
                      <form onSubmit={handleBooking} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                          <Input 
                            placeholder="John Doe" 
                            required 
                            className="bg-secondary/20 border-none h-12"
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                          <Input 
                            type="email" 
                            placeholder="john@example.com" 
                            required 
                            className="bg-secondary/20 border-none h-12"
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">WhatsApp Number</label>
                          <div className="relative">
                            <Input 
                              placeholder="+92 300 1234567" 
                              required
                              className="bg-secondary/20 border-none h-12 pl-10"
                              value={form.whatsapp}
                              onChange={e => setForm({...form, whatsapp: e.target.value})}
                            />
                            <Phone className="w-4 h-4 absolute left-3 top-4 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="pt-4">
                          <Button type="submit" className="w-full h-14 text-lg rounded-xl" disabled={loading || !date}>
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Securing Slot...
                              </>
                            ) : "Confirm Booking"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center space-y-4">
                <p className="text-muted-foreground">Prefer a quick chat?</p>
                <Button variant="outline" className="rounded-full h-12 gap-2" asChild>
                  <a href={`https://wa.me/${agencyWhatsApp.replace(/\+/g, '')}`} target="_blank">
                    <MessageSquare className="w-4 h-4 text-[#25D366]" />
                    Book via WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
