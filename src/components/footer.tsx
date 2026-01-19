import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card-alt pt-5 pb-5">
      <div className="container py-8">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-xl bg-brand text-white flex items-center justify-center text-xs font-semibold shadow-sm">
                AR
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-ink">AskRight</span>
                <span className="text-[10px] text-muted">Prompt Learning</span>
              </div>
            </div>
            <p className="text-sm text-muted max-w-md">
              Learn how to ask AI the right way—by practicing with feedback, not vibes.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted hover:text-ink transition"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted hover:text-ink transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/templates"
                  className="text-sm text-muted hover:text-ink transition"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  href="/learn"
                  className="text-sm text-muted hover:text-ink transition"
                >
                  Learn
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            © {currentYear} AskRight. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span>Educational-first prompt learning</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
