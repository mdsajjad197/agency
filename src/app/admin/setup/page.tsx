"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Loader2, Rocket, ArrowRight } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function AdminSetup() {
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "creating" | "assigning" | "success">("idle");
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const ADMIN_EMAIL = "sajjadsaffan634@gmail.com";
  const ADMIN_PASS = "sajjad19@";

  const handleSetup = async () => {
    setLoading(true);
    setStatus("creating");

    try {
      let user;
      try {
        // Try to create the user
        const credential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASS);
        user = credential.user;
      } catch (e: any) {
        if (e.code === 'auth/email-already-in-use') {
          // If already exists, just sign in to get the UID
          const credential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASS);
          user = credential.user;
        } else {
          throw e;
        }
      }

      setStatus("assigning");

      // Provision Admin Role in Firestore using a valid document path
      // This document's existence grants isAdmin() privileges in firestore.rules
      await setDoc(doc(db, "admin_roles", user.uid), {
        email: ADMIN_EMAIL,
        role: "super-admin",
        active: true,
        initializedAt: new Date().toISOString()
      }, { merge: true });

      // Create Admin Profile
      await setDoc(doc(db, "adminUsers", user.uid), {
        id: user.uid,
        username: "admin_sajjad",
        email: ADMIN_EMAIL,
        role: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setStatus("success");
      toast({
        title: "Setup Complete",
        description: "Your admin account is ready.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Setup failed",
        description: error.message,
        variant: "destructive",
      });
      setStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-6">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-headline font-bold">Admin Initialization</CardTitle>
            <CardDescription className="text-primary-foreground/70">
              Forging your administrative access
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-8 text-center space-y-8">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will create the admin account for <strong>{ADMIN_EMAIL}</strong> and configure database permissions.
            </p>
            <div className="p-4 bg-secondary/50 rounded-2xl text-xs font-mono space-y-1">
              <p>Email: {ADMIN_EMAIL}</p>
              <p>Password: {ADMIN_PASS}</p>
            </div>
          </div>

          {status === "success" ? (
            <Button onClick={() => router.push("/admin/dashboard")} className="w-full h-12 text-lg rounded-xl">
              Go to Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          ) : (
            <Button onClick={handleSetup} className="w-full h-12 text-lg rounded-xl" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {status === "creating" ? "Creating Auth..." : "Granting Roles..."}
                </>
              ) : (
                <>
                  Initialize Admin
                  <Rocket className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          )}

          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            One-time setup utility for StudioForge
          </p>
        </CardContent>
      </Card>
    </div>
  );
}