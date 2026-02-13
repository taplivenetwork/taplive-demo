import Link from "next/link";
import { Radio, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="dark noise-bg min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Radio className="h-5 w-5 text-primary" />
            <span className="font-display text-xl">TapLive</span>
          </Link>
        </div>
      </nav>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="font-display text-3xl">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-muted-foreground">
          <p>This is a placeholder privacy policy for TapLive. In production, this page will contain the full privacy policy detailing how we collect, use, and protect your data.</p>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
