"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? "Login failed");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs tracking-widest uppercase text-white/45 block mb-2">
          Email
        </label>
        <input name="email" type="email" required autoFocus />
      </div>
      <div>
        <label className="text-xs tracking-widest uppercase text-white/45 block mb-2">
          Password
        </label>
        <input name="password" type="password" required />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full px-6 py-3 bg-white text-slate-900 font-semibold tracking-widest text-xs uppercase rounded-full disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
      {error && <p className="text-red-300 text-sm text-center">{error}</p>}
    </form>
  );
}
