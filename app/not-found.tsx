import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found — StreamerBid",
};

export default function RootNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-5xl font-semibold text-accent">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted">The link may be broken, or the page may have been removed.</p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:brightness-110 transition"
      >
        Back to leaderboard
      </Link>
    </div>
  );
}
