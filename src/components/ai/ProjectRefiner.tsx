
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Loader2, Send, CheckCircle } from "lucide-react";
import { refineProjectConcept, type ProjectConceptRefinerOutput } from "@/ai/flows/ai-project-concept-refiner-flow";
import { useToast } from "@/hooks/use-toast";

export function ProjectRefiner() {
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<ProjectConceptRefinerOutput | null>(null);
  const { toast } = useToast();

  const handleRefine = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please share a few words about your project idea first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const output = await refineProjectConcept({ initialConcept: input });
      setResult(output);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "We couldn't process your request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-refiner" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Visual flair */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            AI-Powered Workshop
          </div>
          <h2 className="text-4xl md:text-5xl font-headline font-bold">Refine Your Vision</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Have a vague idea? Tell us about it. Our AI will help structure your concept into a professional project brief in seconds.
          </p>
        </div>

        <Card className="bg-white text-foreground overflow-hidden shadow-2xl rounded-3xl">
          {!result ? (
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-bold uppercase tracking-widest text-primary">Describe your idea</p>
                <Textarea
                  placeholder="e.g., I want to build a minimal online store for handmade ceramic vases..."
                  className="min-h-[150px] text-lg p-6 bg-secondary/30 border-none focus-visible:ring-primary"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleRefine} 
                className="w-full h-14 text-lg rounded-2xl group" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Concept...
                  </>
                ) : (
                  <>
                    Refine My Idea
                    <Sparkles className="ml-2 h-5 w-5 text-accent group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <CardHeader className="bg-primary/5 border-b p-8">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-3xl font-headline text-primary">{result.projectName}</CardTitle>
                    <CardDescription className="text-base mt-2">Structured Concept Result</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setResult(null)} size="sm">Start Over</Button>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Project Type</p>
                    <p className="font-medium text-lg">{result.projectType}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Target Audience</p>
                    <p className="text-muted-foreground">{result.targetAudience}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Core Features</p>
                  <div className="flex flex-wrap gap-2">
                    {result.coreFeatures.map((feature, i) => (
                      <div key={i} className="px-4 py-2 bg-secondary/50 rounded-lg text-sm font-medium border border-border flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Primary Goals</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      {result.mainGoals.map((goal, i) => <li key={i}>{goal}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Design Aesthetic</p>
                    <p className="text-muted-foreground">{result.designPreferences}</p>
                  </div>
                </div>

                <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Recommended Action</p>
                    <p className="font-headline font-bold text-xl">{result.callToAction}</p>
                  </div>
                  <Button size="lg" className="rounded-full px-10 h-14 group" asChild>
                    <a href="#contact">
                      Discuss This Plan
                      <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
