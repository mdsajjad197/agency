
"use client";

import * as React from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, User, Mail, Trash2, LayoutDashboard, FileText, Inbox, LogOut, Clock } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function BookingsManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isUserLoading && !user) router.push("/admin/login");
  }, [user, isUserLoading, router]);

  const bookingsQuery = React.useMemo(() => {
    return query(collection(db, "bookings"), orderBy("date", "asc"));
  }, [db]);

  const { data: bookings, isLoading } = useCollection(bookingsQuery as any);

  const handleDelete = async (id: string) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await deleteDoc(doc(db, "bookings", id));
      toast({ title: "Booking cancelled" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (isUserLoading || !user) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-secondary/20 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-foreground text-white p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-headline font-bold text-xl">AdminForge</span>
        </div>
        <nav className="flex-1 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-3 p-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <FileText className="w-5 h-5" />
            Blog Posts
          </Link>
          <Link href="/admin/inquiries" className="flex items-center gap-3 p-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Inbox className="w-5 h-5" />
            Inquiries
          </Link>
          <Link href="/admin/bookings" className="flex items-center gap-3 p-3 bg-primary rounded-xl text-white">
            <Clock className="w-5 h-5" />
            Bookings
          </Link>
        </nav>
        <Button variant="ghost" className="justify-start gap-3 text-white/60 hover:text-red-400 p-3" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-bold">Appointments</h1>
            <p className="text-muted-foreground">Review your upcoming consultations.</p>
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              <div className="p-20 text-center">Loading...</div>
            ) : bookings?.length ? (
              bookings.map((booking) => (
                <Card key={booking.id} className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex flex-col items-center justify-center">
                        <span className="text-xs font-bold uppercase">{new Date(booking.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-2xl font-bold">{new Date(booking.date).getDate()}</span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg">{booking.clientName}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {booking.clientEmail}
                        </p>
                        <p className="text-xs font-bold text-primary flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.time}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(booking.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-20 text-center bg-white rounded-3xl text-muted-foreground">
                No upcoming bookings.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
