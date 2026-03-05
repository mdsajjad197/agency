import Link from "next/link";
import { Rocket } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          <div className="space-y-6 col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
                <Rocket className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-headline font-bold tracking-tight">
                SS Studio
              </span>
            </Link>
            <p className="text-white/60 leading-relaxed max-w-xs">
              Transforming businesses with premium web design and development. Your digital vision, forged into reality.
            </p>
          </div>

          <div>
            <h5 className="font-headline font-bold text-lg mb-6">Services</h5>
            <ul className="space-y-4 text-white/60">
              <li><Link href="/#services" className="hover:text-primary transition-colors">E-commerce</Link></li>
              <li><Link href="/#services" className="hover:text-primary transition-colors">Landing Pages</Link></li>
              <li><Link href="/#services" className="hover:text-primary transition-colors">Static Websites</Link></li>
              <li><Link href="/#services" className="hover:text-primary transition-colors">UI/UX Design</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-headline font-bold text-lg mb-6">Company</h5>
            <ul className="space-y-4 text-white/60">
              <li><Link href="/#portfolio" className="hover:text-primary transition-colors">Portfolio</Link></li>
              <li><Link href="/#process" className="hover:text-primary transition-colors">Our Process</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Insights (Blog)</Link></li>
              <li><Link href="/booking" className="hover:text-primary transition-colors">Book a Call</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between gap-6 text-white/40 text-sm font-medium">
          <p>© {new Date().getFullYear()} SS Studio. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
