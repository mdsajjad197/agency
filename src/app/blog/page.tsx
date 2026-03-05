
"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar, FileText } from "lucide-react";
import Link from "next/link";

export default function BlogFeed() {
  const db = useFirestore();

  const blogQuery = useMemoFirebase(() => {
    return query(
      collection(db, "public_blog_posts"),
      orderBy("createdAt", "desc")
    );
  }, [db]);

  const { data: posts, isLoading } = useCollection(blogQuery);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-32 bg-[#fcfcfc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20 space-y-6">
            <h1 className="text-6xl md:text-7xl font-headline font-bold leading-tight">
              Insights for <br />
              <span className="text-primary italic">Digital Mastery.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Explore our latest thoughts on e-commerce development, UI/UX trends, and high-performance web engineering.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[400px] bg-secondary/20 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : posts?.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {posts.map((post) => (
                <Card key={post.id} className="border-none shadow-none bg-transparent group cursor-pointer overflow-hidden">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 shadow-sm ring-1 ring-black/5">
                      {post.featuredImageUrl ? (
                        <img 
                          src={post.featuredImageUrl} 
                          alt={post.title} 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="bg-secondary/50 w-full h-full flex items-center justify-center">
                          <FileText className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                          Featured
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 5 min read</span>
                      </div>
                      <h3 className="text-2xl font-headline font-bold leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="pt-2">
                        <Button variant="link" className="p-0 text-primary font-bold gap-2 group-hover:gap-3 transition-all">
                          Read Article <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center bg-secondary/10 rounded-3xl">
              <h2 className="text-2xl font-headline font-bold">No articles published yet.</h2>
              <p className="text-muted-foreground mt-2">Check back soon for new insights.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
