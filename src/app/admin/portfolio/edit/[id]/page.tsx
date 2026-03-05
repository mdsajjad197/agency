
"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, collection } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Image as ImageIcon,
  LayoutDashboard,
  FileText,
  Inbox,
  LogOut,
  Clock,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function EditPortfolioProject() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { id } = useParams();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  const projectRef = useMemoFirebase(() => doc(db, "portfolio_projects", id as string), [db, id]);
  const { data: project, isLoading: isProjectLoading } = useDoc(projectRef);

  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    category: "E-commerce",
    description: "",
    imageUrl: "",
    projectUrl: "",
    tags: "",
  });

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isUserLoading, router]);

  React.useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        category: project.category || "E-commerce",
        description: project.description || "",
        imageUrl: project.imageUrl || "",
        projectUrl: project.projectUrl || "",
        tags: project.tags?.join(", ") || "",
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    
    setLoading(true);
    const updatedData = {
      ...formData,
      id: id as string,
      tags: formData.tags.split(",").map(t => t.trim()).filter(t => !!t),
      updatedAt: new Date().toISOString(),
      createdAt: project?.createdAt || new Date().toISOString(),
    };

    setDoc(projectRef, updatedData, { merge: true })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: projectRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        }));
      });

    toast({
      title: "Success",
      description: "Project updated successfully.",
    });

    router.push("/admin/portfolio");
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (isUserLoading || isProjectLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Project Data...</div>;
  }

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
          <Link href="/admin/portfolio" className="flex items-center gap-3 p-3 bg-primary rounded-xl text-white">
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

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-headline font-bold">Edit Project</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-headline">Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Project Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., MordenShop Redesign"
                        required
                        className="h-12 bg-secondary/20 border-none font-bold text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Short Description</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Explain what this project achieved..."
                        required
                        className="bg-secondary/20 border-none min-h-[120px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tags (comma separated)</label>
                      <Input
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="Next.js, Tailwind, Framer Motion"
                        className="bg-secondary/20 border-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-headline">Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-12 rounded-xl bg-secondary/20 border-none px-4 text-sm outline-none"
                      >
                        <option>E-commerce</option>
                        <option>AI & EdTech</option>
                        <option>Marketplace</option>
                        <option>Landing Page</option>
                        <option>Corporate</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Showcase Image URL</label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          placeholder="https://..."
                          required
                          className="bg-secondary/20 border-none"
                        />
                        <Button type="button" variant="outline" size="icon" className="shrink-0 rounded-lg">
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      {formData.imageUrl && (
                        <div className="mt-2 aspect-video rounded-xl overflow-hidden border">
                          <img src={formData.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Project URL</label>
                      <Input
                        value={formData.projectUrl}
                        onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                        placeholder="https://example.com"
                        className="bg-secondary/20 border-none"
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Update Project
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
