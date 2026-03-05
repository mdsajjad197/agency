
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Rocket, Loader2, Lock, UserCheck } from "lucide-react";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [email, setEmail] = React.useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "");
  const [password, setPassword] = React.useState(process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to the admin panel.",
      });
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-6">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-headline font-bold">StudioForge Admin</CardTitle>
            <CardDescription className="text-primary-foreground/70">
              Enter your credentials to manage your digital studio
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Admin Email</label>
              <Input
                type="email"
                placeholder="admin@studioforge.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-secondary/20 border-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-secondary/20 border-none"
              />
            </div>
            <div className="space-y-4">
              <Button type="submit" className="w-full h-12 text-lg rounded-xl" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <Lock className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
              
              {process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                <div className="pt-4 text-center">
                  <p className="text-[10px] uppercase tracking-tighter text-muted-foreground mb-2">Development Mode</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-xs h-8 rounded-full border-dashed"
                    onClick={() => {
                      setEmail(process.env.NEXT_PUBLIC_ADMIN_EMAIL!);
                      setPassword(process.env.NEXT_PUBLIC_ADMIN_PASSWORD!);
                    }}
                  >
                    <UserCheck className="w-3 h-3 mr-2" />
                    Use Default Admin
                  </Button>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
