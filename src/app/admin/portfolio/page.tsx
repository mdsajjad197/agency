
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  LayoutDashboard, 
  FileText, 
  Inbox, 
  Clock,
  LogOut,
  MoreVertical,
  ExternalLink
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

export default function PortfolioManagement() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isUserLoading, router]);

  const projectsQuery = useMemoFirebase(() => {
    return query(collection(db, "portfolio_projects"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: projects, isLoading } = useCollection(projectsQuery);

  const confirmDelete = () => {
    if (!deleteId) return;

    const docRef = doc(db, "portfolio_projects", deleteId);
    deleteDocumentNonBlocking(docRef);

    toast({
      title: "Deletion started",
      description: "The project is being removed from your portfolio.",
    });
    setDeleteId(null);
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

        <Button variant="ghost" className="justify-start gap-3 text-white/60 hover:text-red-400 hover:bg-red-400/10 p-3" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-3xl font-headline font-bold">Portfolio Management</h1>
              <p className="text-muted-foreground">Showcase your best work to potential clients.</p>
            </div>
            <Button size="lg" className="rounded-full gap-2 shadow-lg shadow-primary/20" asChild>
              <Link href="/admin/portfolio/new">
                <Plus className="w-5 h-5" />
                Add New Project
              </Link>
            </Button>
          </div>

          <Card className="border-none shadow-sm overflow-hidden bg-white rounded-2xl">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-20 text-center">Loading projects...</div>
              ) : projects && projects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-secondary/10 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b">
                      <tr>
                        <th className="p-6">Project</th>
                        <th className="p-6">Category</th>
                        <th className="p-6">Date Added</th>
                        <th className="p-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-secondary/5 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary relative">
                                <img src={project.imageUrl} alt={project.title} className="object-cover w-full h-full" />
                              </div>
                              <div className="space-y-1">
                                <p className="font-bold text-lg group-hover:text-primary transition-colors">{project.title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{project.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {project.category}
                            </span>
                          </td>
                          <td className="p-6 text-sm text-muted-foreground">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/portfolio/edit/${project.id}`}>
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
                                  {project.projectUrl && (
                                    <DropdownMenuItem asChild>
                                      <a href={project.projectUrl} target="_blank" className="cursor-pointer">
                                        <ExternalLink className="w-4 h-4 mr-2" /> View Live
                                      </a>
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive cursor-pointer" 
                                    onClick={() => setDeleteId(project.id)}
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
                    <Briefcase className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-headline font-bold">No projects found</p>
                    <p className="text-muted-foreground">Start building your agency portfolio.</p>
                  </div>
                  <Button asChild className="rounded-full">
                    <Link href="/admin/portfolio/new">Add Your First Project</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this project?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. It will permanently remove this project from your public showcase.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
                Delete Project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
