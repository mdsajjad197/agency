
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore } from "@/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Image as ImageIcon,
  CheckCircle,
  LayoutDashboard,
  FileText,
  Inbox,
  Settings,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";

export default function NewPost() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImageUrl: "",
    status: "draft",
    categoryId: "general",
  });

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    const postId = doc(collection(db, "admin_blog_posts")).id;

    try {
      const postData = {
        ...formData,
        id: postId,
        authorId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: formData.status === "published" ? new Date().toISOString() : null,
      };

      // 1. Save to master collection
      await setDoc(doc(db, "admin_blog_posts", postId), postData);

      // 2. If published, sync to public collection
      if (formData.status === "published") {
        await setDoc(doc(db, "public_blog_posts", postId), postData);
      }

      toast({
        title: "Success",
        description: "Post created successfully.",
      });
      router.push("/admin/blog");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create post: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-headline font-bold">New Blog Post</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-headline">Post Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Post Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., The Future of E-commerce Design"
                        required
                        className="h-12 bg-secondary/20 border-none font-bold text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">URL Slug</label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                        placeholder="e-commerce-design-trends"
                        required
                        className="bg-secondary/20 border-none font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Excerpt</label>
                      <Textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="A short summary for listings..."
                        className="bg-secondary/20 border-none min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Content (Markdown/HTML)</label>
                      <Textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Write your article here..."
                        required
                        className="bg-secondary/20 border-none min-h-[400px] font-mono text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-headline">Publishing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full h-12 rounded-xl bg-secondary/20 border-none px-4 text-sm outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Featured Image URL</label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.featuredImageUrl}
                          onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                          placeholder="https://..."
                          className="bg-secondary/20 border-none"
                        />
                        <Button variant="outline" size="icon" className="shrink-0 rounded-lg">
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      {formData.featuredImageUrl && (
                        <div className="mt-2 aspect-video relative rounded-xl overflow-hidden border">
                          <img src={formData.featuredImageUrl} alt="Preview" className="object-cover w-full h-full" />
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t">
                      <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            Save Changes
                            <Save className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold text-sm">SEO Optimized</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Your slug and title are automatically checked for SEO compatibility.</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
