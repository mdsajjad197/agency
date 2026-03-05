
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { Portfolio } from "@/components/home/Portfolio";
import { Process } from "@/components/home/Process";
import { ProjectRefiner } from "@/components/ai/ProjectRefiner";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Portfolio />
        <Process />
        <ProjectRefiner />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
