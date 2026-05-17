"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign out
    </button>
  );
}
