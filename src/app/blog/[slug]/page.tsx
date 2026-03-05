
"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react";
import Link from "next/link";

export default function BlogPostDetail() {
  const { slug } = useParams();
  const db = useFirestore();

  const blogQuery = useMemoFirebase(() => {
    return query(
      collection(db, "public_blog_posts"),
      where("slug", "==", slug),
      limit(1)
    );
  }, [db, slug]);

  const { data: posts, isLoading } = useCollection(blogQuery);
  const post = posts?.[0];

  if (isLoading) return <div className="p-40 text-center">Loading...</div>;
  if (!post) return <div className="p-40 text-center">Post not found. <Link href="/blog" className="text-primary underline">Go back</Link></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <article>
          {/* Hero Section */}
          <header className="pt-40 pb-20 px-6 bg-secondary/20">
            <div className="max-w-4xl mx-auto space-y-8 text-center">
              <Link href="/blog">
                <Button variant="ghost" size="sm" className="rounded-full gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Insights
                </Button>
              </Link>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 5 Minute Read</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-headline font-bold leading-[1.1] tracking-tight">
                  {post.title}
                </h1>
              </div>

              {post.featuredImageUrl && (
                <div className="aspect-video relative rounded-[3rem] overflow-hidden shadow-2xl mt-12 ring-1 ring-black/5">
                  <img src={post.featuredImageUrl} alt={post.title} className="object-cover w-full h-full" />
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <section className="py-20 px-6">
            <div className="max-w-3xl mx-auto">
              <div 
                className="prose prose-xl prose-primary max-w-none font-body leading-relaxed text-foreground/80
                prose-headings:font-headline prose-headings:font-bold prose-headings:text-foreground
                prose-p:mb-8 prose-li:mb-2 prose-img:rounded-3xl prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
              />
              
              <div className="mt-20 pt-10 border-t flex flex-col sm:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    SS
                  </div>
                  <div>
                    <p className="text-sm font-bold">Sajjad</p>
                    <p className="text-xs text-muted-foreground">Founder & Lead Engineer</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-full gap-2" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied!");
                }}>
                  <Share2 className="w-4 h-4" />
                  Share Insight
                </Button>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
