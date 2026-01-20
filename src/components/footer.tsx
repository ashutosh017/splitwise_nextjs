import Link from "next/link";
import { Receipt, Github, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            <span className="font-bold">SplitWise</span>
          </Link>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {currentYear} Built for your team.
          </p>

          {/* Links */}
          <div className="flex items-center gap-5">
            <Link
              href="https://github.com/ashutosh017"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-black dark:hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>

            <Link
              href="https://x.com/ashutosh__018"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-black dark:hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
