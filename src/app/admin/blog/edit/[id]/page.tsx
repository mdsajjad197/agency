
"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, deleteDoc, collection } from "firebase/firestore";
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
  LogOut,
  Clock,
  Upload
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function EditPost() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { id } = useParams();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  const postRef = useMemoFirebase(() => doc(db, "admin_blog_posts", id as string), [db, id]);
  const { data: post, isLoading: isPostLoading } = useDoc(postRef);

  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImageUrl: "",
    status: "draft",
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isUserLoading, router]);

  React.useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        featuredImageUrl: post.featuredImageUrl || "",
        status: post.status || "draft",
      });
    }
  }, [post]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, featuredImageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    
    setLoading(true);
    const postId = id as string;
    const adminRef = doc(db, "admin_blog_posts", postId);
    const publicRef = doc(db, "public_blog_posts", postId);

    const updatedData = {
      ...formData,
      id: postId,
      authorId: user.uid,
      updatedAt: new Date().toISOString(),
      createdAt: post?.createdAt || new Date().toISOString(),
      publishedAt: formData.status === "published" ? (post?.publishedAt || new Date().toISOString()) : null,
    };

    setDoc(adminRef, updatedData, { merge: true })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: adminRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        }));
      });

    if (formData.status === "published") {
      setDoc(publicRef, updatedData, { merge: true })
        .catch(async (error) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: publicRef.path,
            operation: 'write',
            requestResourceData: updatedData,
          }));
        });
    } else {
      deleteDoc(publicRef).catch(() => {});
    }

    toast({
      title: "Saving changes",
      description: "Your updates are being synchronized.",
    });

    router.push("/admin/blog");
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (isUserLoading || isPostLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Article Data...</div>;
  }

  return (
    <div className="min-h-screen bg-secondary/20 flex">
      <aside className="w-64 bg-foreground text-white p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-xl">SS Studio</span>
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
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-headline font-bold">Edit Post</h1>
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
                        placeholder="A short summary..."
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
                        className="w-full h-12 rounded-xl bg-secondary/20 border-none px-4 text-sm outline-none"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Featured Image</label>
                      <div 
                        className="relative aspect-video rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-secondary/10 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/20 transition-all"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {formData.featuredImageUrl ? (
                          <img src={formData.featuredImageUrl} alt="Preview" className="object-cover w-full h-full" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Upload className="w-8 h-8" />
                            <span className="text-xs font-bold uppercase">Upload Image</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleFileChange}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Or Image URL</label>
                        <Input
                          value={formData.featuredImageUrl.startsWith('data:') ? '' : formData.featuredImageUrl}
                          onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                          placeholder="https://..."
                          className="bg-secondary/20 border-none mt-1"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            Update Article
                            <Save className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
