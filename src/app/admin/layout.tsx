import type { Metadata } from "next";
import Link from "next/link";
import AdminNav from "./AdminNav";
import SignOutButton from "./SignOutButton";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Inflexions Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f1621] text-white">
      <header className="sticky top-0 z-40 bg-[#0f1621]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#BD2E25] flex items-center justify-center text-xs font-bold">
              I
            </div>
            <span className="text-sm font-semibold whitespace-nowrap">
              Inflexions Admin
            </span>
          </Link>
          <div className="flex-1 min-w-0 overflow-hidden">
            <AdminNav />
          </div>
          <SignOutButton />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
