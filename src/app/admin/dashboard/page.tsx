
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Users, 
  Plus, 
  Settings, 
  LogOut,
  TrendingUp,
  Inbox
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const db = useFirestore();
  const auth = useAuth();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isUserLoading, router]);

  const postsQuery = React.useMemo(() => {
    return query(collection(db, "admin_blog_posts"), orderBy("createdAt", "desc"), limit(5));
  }, [db]);

  const inquiriesQuery = React.useMemo(() => {
    return query(collection(db, "inquiries"), orderBy("createdAt", "desc"), limit(5));
  }, [db]);

  const { data: recentPosts } = useCollection(postsQuery as any);
  const { data: recentInquiries } = useCollection(inquiriesQuery as any);

  if (isUserLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><TrendingUp className="animate-spin text-primary" /></div>;
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-secondary/20 flex">
      {/* Admin Sidebar */}
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
          <Link href="/admin/blog" className="flex items-center gap-3 p-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <FileText className="w-5 h-5" />
            Blog Posts
          </Link>
          <Link href="/admin/inquiries" className="flex items-center gap-3 p-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Inbox className="w-5 h-5" />
            Inquiries
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 p-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <Button variant="ghost" className="justify-start gap-3 text-white/60 hover:text-red-400 hover:bg-red-400/10 p-3" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Overview of your studio's activity.</p>
            </div>
            <Button size="lg" className="rounded-full gap-2 shadow-lg shadow-primary/20" asChild>
              <Link href="/admin/blog/new">
                <Plus className="w-5 h-5" />
                New Post
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                  <p className="text-2xl font-bold">{recentPosts?.length || 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
                  <Inbox className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Inquiries</p>
                  <p className="text-2xl font-bold">{recentInquiries?.length || 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Recent Posts */}
            <div className="space-y-4">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Blog Posts
              </h2>
              <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                  {recentPosts && recentPosts.length > 0 ? (
                    <ul className="divide-y">
                      {recentPosts.map((post) => (
                        <li key={post.id} className="p-4 flex justify-between items-center hover:bg-secondary/10 transition-colors">
                          <div className="space-y-1">
                            <p className="font-medium truncate max-w-[200px]">{post.title}</p>
                            <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                          </div>
                          <Link href={`/admin/blog/edit/${post.id}`}>
                            <Button variant="outline" size="sm" className="rounded-lg">Edit</Button>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-10 text-center text-muted-foreground">No posts yet.</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Inquiries */}
            <div className="space-y-4">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent" />
                Recent Inquiries
              </h2>
              <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                  {recentInquiries && recentInquiries.length > 0 ? (
                    <ul className="divide-y">
                      {recentInquiries.map((inquiry) => (
                        <li key={inquiry.id} className="p-4 flex justify-between items-center hover:bg-secondary/10 transition-colors">
                          <div className="space-y-1">
                            <p className="font-medium">{inquiry.clientName}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{inquiry.message}</p>
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
                            {inquiry.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-10 text-center text-muted-foreground">No inquiries yet.</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
