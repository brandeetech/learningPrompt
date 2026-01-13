'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/templates", label: "Templates" },
  { href: "/learn", label: "Learn" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/85 bg-white/90">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-brand text-white flex items-center justify-center text-sm font-semibold shadow-sm">
            AR
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-ink">AskRight</span>
            <span className="text-xs text-muted">Prompt Learning</span>
          </div>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 transition-colors ${
                  active
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted hover:text-ink hover:bg-card-alt"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/auth"
            className="ml-1 rounded-full border border-border px-3 py-2 text-sm font-semibold text-ink transition hover:border-brand hover:bg-card-alt"
          >
            Sign in
          </Link>
          <Link
            href="/play"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-strong"
          >
            Playground
          </Link>
        </nav>
      </div>
    </header>
  );
}
