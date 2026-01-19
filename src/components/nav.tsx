'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, signOut } from "@/lib/auth";

const links = [
  { href: "/", label: "Home" },
  { href: "/templates", label: "Templates" },
  { href: "/learn", label: "Learn" },
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('[Nav] Sign out error:', error);
    }
  };

  const isHomePage = pathname === "/";

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card-alt py-2.5">
      <div className="container flex items-center justify-between py-6">
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
          {links.filter(link => link.href !== "/").map((link) => {
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
          <div className="ml-2 flex items-center gap-2">
            {loading ? (
              <div className="h-9 w-20 rounded-full bg-card-alt animate-pulse" />
            ) : isHomePage ? (
              <Link
                href="/play"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-accent/90"
              >
                Practice
              </Link>
            ) : user ? (
              <>
                <Link
                  href="/play"
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90"
                >
                  Practice
                </Link>
                <button
                  onClick={handleSignOut}
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand hover:bg-card-alt"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-strong"
              >
                Get started
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
