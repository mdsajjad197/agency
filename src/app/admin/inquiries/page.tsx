
"use client";

import * as React from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, Mail, User, Clock, Trash2, CheckCircle, LayoutDashboard, FileText, LogOut, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function InquiriesManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isUserLoading && !user) router.push("/admin/login");
  }, [user, isUserLoading, router]);

  const inquiriesQuery = useMemoFirebase(() => {
    return query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: inquiries, isLoading } = useCollection(inquiriesQuery);

  const confirmDelete = () => {
    if (!deleteId) return;
    const docRef = doc(db, "inquiries", deleteId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Inquiry removed" });
    setDeleteId(null);
  };

  const handleStatusUpdate = (id: string, status: string) => {
    const docRef = doc(db, "inquiries", id);
    updateDocumentNonBlocking(docRef, { status });
    toast({ title: "Status updated" });
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (isUserLoading || !user) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-secondary/20 flex">
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
          <Link href="/admin/inquiries" className="flex items-center gap-3 p-3 bg-primary rounded-xl text-white">
            <Inbox className="w-5 h-5" />
            Inquiries
          </Link>
          <Link href="/admin/bookings" className="flex items-center gap-3 p-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
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
            <h1 className="text-3xl font-headline font-bold">Inquiries</h1>
            <p className="text-muted-foreground">Manage leads from your contact forms.</p>
          </div>

          <div className="grid gap-6">
            {isLoading ? (
              <div className="p-20 text-center">Loading...</div>
            ) : inquiries?.length ? (
              inquiries.map((lead) => (
                <Card key={lead.id} className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                              <User className="w-4 h-4 text-primary" />
                              {lead.clientName}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {lead.clientEmail}
                              </p>
                              {lead.whatsappNumber && (
                                <p className="flex items-center gap-2 text-[#25D366] font-medium">
                                  <MessageSquare className="w-4 h-4" />
                                  {lead.whatsappNumber}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                            lead.status === 'new' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {lead.status}
                          </span>
                        </div>
                        <div className="p-4 bg-secondary/20 rounded-xl text-sm italic">
                          "{lead.message}"
                        </div>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </span>
                          <span className="font-bold text-primary uppercase">{lead.serviceRequired}</span>
                        </div>
                      </div>
                      <div className="bg-secondary/10 p-6 flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l">
                        {lead.status === 'new' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg gap-2 text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleStatusUpdate(lead.id, 'contacted')}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Contacted
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-lg gap-2 text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteId(lead.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-20 text-center bg-white rounded-3xl text-muted-foreground">
                No inquiries found.
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Inquiry?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete the lead record from your dashboard. This action is permanent.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
                Delete Record
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
