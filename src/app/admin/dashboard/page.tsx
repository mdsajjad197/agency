
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  LogOut,
  TrendingUp,
  Inbox,
  Clock,
  ArrowRight,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const db = useFirestore();
  const auth = useAuth();

  React.useEffect(() => {
    if (!isUserLoading && !user) router.push("/admin/login");
  }, [user, isUserLoading, router]);

  const postsQuery = useMemoFirebase(() => query(collection(db, "admin_blog_posts"), orderBy("createdAt", "desc"), limit(5)), [db]);
  const inquiriesQuery = useMemoFirebase(() => query(collection(db, "inquiries"), orderBy("createdAt", "desc"), limit(5)), [db]);
  const bookingsQuery = useMemoFirebase(() => query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(5)), [db]);
  const projectsQuery = useMemoFirebase(() => query(collection(db, "portfolio_projects"), orderBy("createdAt", "desc"), limit(5)), [db]);

  const { data: recentPosts } = useCollection(postsQuery);
  const { data: recentInquiries } = useCollection(inquiriesQuery);
  const { data: recentBookings } = useCollection(bookingsQuery);
  const { data: recentProjects } = useCollection(projectsQuery);

  if (isUserLoading || !user) return <div className="min-h-screen flex items-center justify-center"><TrendingUp className="animate-spin text-primary" /></div>;

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

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
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 bg-primary rounded-xl text-white">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/portfolio" className="flex items-center gap-3 p-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Briefcase className="w-5 h-5" />
            Portfolio
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-3 p-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <FileText className="w-5 h-5" />
            Blog Posts
          </Link>
          <Link href="/admin/inquiries" className="flex items-center gap-3 p-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
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

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-3xl font-headline font-bold">Welcome back, Sajjad</h1>
              <p className="text-muted-foreground">Your digital studio at a glance.</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="rounded-full gap-2" asChild>
                <Link href="/admin/portfolio/new"><Briefcase className="w-4 h-4" /> New Project</Link>
              </Button>
              <Button className="rounded-full gap-2 shadow-lg" asChild>
                <Link href="/admin/blog/new"><Plus className="w-5 h-5" /> New Post</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-none shadow-sm bg-white p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><FileText /></div>
              <div><p className="text-xs font-bold uppercase text-muted-foreground">Posts</p><p className="text-2xl font-bold">{recentPosts?.length || 0}</p></div>
            </Card>
            <Card className="border-none shadow-sm bg-white p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center"><Inbox /></div>
              <div><p className="text-xs font-bold uppercase text-muted-foreground">Leads</p><p className="text-2xl font-bold">{recentInquiries?.length || 0}</p></div>
            </Card>
            <Card className="border-none shadow-sm bg-white p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center"><Clock /></div>
              <div><p className="text-xs font-bold uppercase text-muted-foreground">Bookings</p><p className="text-2xl font-bold">{recentBookings?.length || 0}</p></div>
            </Card>
            <Card className="border-none shadow-sm bg-white p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center"><Briefcase /></div>
              <div><p className="text-xs font-bold uppercase text-muted-foreground">Projects</p><p className="text-2xl font-bold">{recentProjects?.length || 0}</p></div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-headline font-bold">Recent Leads</h2>
                <Button variant="ghost" size="sm" asChild><Link href="/admin/inquiries">View All <ArrowRight className="ml-2 w-4 h-4" /></Link></Button>
              </div>
              <Card className="border-none shadow-sm">
                <div className="divide-y">
                  {recentInquiries?.map(lead => (
                    <div key={lead.id} className="p-4 flex justify-between items-center hover:bg-secondary/5">
                      <div><p className="font-bold">{lead.clientName}</p><p className="text-xs text-muted-foreground">{lead.clientEmail}</p></div>
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-600 px-2 py-1 rounded">{lead.status}</span>
                    </div>
                  ))}
                  {!recentInquiries?.length && <div className="p-10 text-center text-muted-foreground">No leads yet.</div>}
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-headline font-bold">Latest Projects</h2>
                <Button variant="ghost" size="sm" asChild><Link href="/admin/portfolio">View All <ArrowRight className="ml-2 w-4 h-4" /></Link></Button>
              </div>
              <Card className="border-none shadow-sm">
                <div className="divide-y">
                  {recentProjects?.map(project => (
                    <div key={project.id} className="p-4 flex justify-between items-center hover:bg-secondary/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-secondary overflow-hidden">
                          <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div><p className="font-bold">{project.title}</p><p className="text-xs text-muted-foreground">{project.category}</p></div>
                      </div>
                      <Link href={`/admin/portfolio/edit/${project.id}`}><Button variant="outline" size="sm">Edit</Button></Link>
                    </div>
                  ))}
                  {!recentProjects?.length && <div className="p-10 text-center text-muted-foreground">No projects listed.</div>}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
