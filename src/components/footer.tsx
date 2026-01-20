import Link from "next/link";
import { Receipt, Github, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10  py-8 pb-24 md:pb-8 absolute bottom-0">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* 1. Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            <span className="font-bold">SplitWise</span>
          </Link>

          {/* 2. Simple Copyright */}
          <p className="text-xs text-muted-foreground order-3 md:order-2">
            © {currentYear} Built for your team.
          </p>

          {/* 3. Social Links */}
          <div className="flex items-center gap-5 order-2 md:order-3">
            <Link
              target="_blank"
              href="https://x.com/ashutosh__018"
              className="text-muted-foreground hover:text-black dark:hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              target="_blank"
              href="https://github.com/ashutosh017"
              className="text-muted-foreground hover:text-black dark:hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:underline"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
