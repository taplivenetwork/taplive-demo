import Link from "next/link";
import { Radio, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="dark noise-bg min-h-screen text-foreground" style={{ backgroundColor: "#050505" }}>
      <nav className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(5,5,5,0.8)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00FFA3]">
              <Radio className="h-3.5 w-3.5 text-[#050505]" />
            </div>
            <span className="text-lg font-bold">TapLive</span>
          </Link>
        </div>
      </nav>
      <div className="mx-auto max-w-2xl px-5 py-12">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-white/40">
          <p>This is a placeholder privacy policy for TapLive. In production, this page will contain the full privacy policy detailing how we collect, use, and protect your data.</p>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
