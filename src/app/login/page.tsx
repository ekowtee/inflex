"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, LogIn } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl,
    });
    setSubmitting(false);
    if (result?.error) {
      setError("Invalid username or password.");
      return;
    }
    router.replace(result?.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1621] px-4">
      <div className="w-full max-w-md bg-[#171f2c] border border-white/10 rounded-xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#BD2E25] flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white text-lg font-semibold">Inflexions Admin</h1>
            <p className="text-white/50 text-xs">Sign in to manage the CRM</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-xs uppercase tracking-wide text-white/60 mb-1.5">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md bg-[#0f1621] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#BD2E25] focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs uppercase tracking-wide text-white/60 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-[#0f1621] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#BD2E25] focus:border-transparent"
            />
          </div>

          {error && (
            <div className="rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#BD2E25] hover:bg-[#A02923] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 text-sm transition-colors"
          >
            <LogIn className="w-4 h-4" />
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
