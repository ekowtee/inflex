"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton({ username }: { username?: string | null }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      title="Sign out"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 text-sm text-white/80 hover:text-white transition-colors whitespace-nowrap"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">
        Sign out{username ? ` (${username})` : ""}
      </span>
    </button>
  );
}
