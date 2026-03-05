
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  LayoutDashboard, 
  Inbox, 
  Settings, 
  LogOut,
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BlogManagement() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isUserLoading, router]);

  const postsQuery = React.useMemo(() => {
    return query(collection(db, "admin_blog_posts"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: posts, isLoading } = useCollection(postsQuery as any);

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await deleteDoc(doc(db, "admin_blog_posts", postId));
      // Also delete from public if it exists
      await deleteDoc(doc(db, "public_blog_posts", postId));
      toast({
        title: "Post deleted",
        description: "The blog post has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete post: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (isUserLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-3 p-3 bg-primary rounded-xl text-white">
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
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-3xl font-headline font-bold">Blog Posts</h1>
              <p className="text-muted-foreground">Manage your articles, drafts, and archives.</p>
            </div>
            <Button size="lg" className="rounded-full gap-2 shadow-lg shadow-primary/20" asChild>
              <Link href="/admin/blog/new">
                <Plus className="w-5 h-5" />
                Create New Post
              </Link>
            </Button>
          </div>

          <Card className="border-none shadow-sm overflow-hidden bg-white rounded-2xl">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-20 text-center">Loading posts...</div>
              ) : posts && posts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-secondary/10 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b">
                      <tr>
                        <th className="p-6">Article</th>
                        <th className="p-6">Status</th>
                        <th className="p-6">Date</th>
                        <th className="p-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-secondary/5 transition-colors group">
                          <td className="p-6">
                            <div className="space-y-1">
                              <p className="font-bold text-lg group-hover:text-primary transition-colors">{post.title}</p>
                              <p className="text-sm text-muted-foreground">/{post.slug}</p>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                              post.status === 'published' ? 'bg-green-100 text-green-600' : 
                              post.status === 'draft' ? 'bg-yellow-100 text-yellow-600' : 
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="p-6 text-sm text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/blog/edit/${post.id}`}>
                                <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg">
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                              </Link>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/blog/${post.slug}`} className="cursor-pointer">
                                      <Eye className="w-4 h-4 mr-2" /> View Public
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive cursor-pointer" 
                                    onClick={() => handleDelete(post.id)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-headline font-bold">No posts found</p>
                    <p className="text-muted-foreground">Get started by creating your first article.</p>
                  </div>
                  <Button asChild className="rounded-full">
                    <Link href="/admin/blog/new">Create Post</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
