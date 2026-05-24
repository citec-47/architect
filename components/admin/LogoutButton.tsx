"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="px-4 py-2 text-xs tracking-widest uppercase text-white/80 border border-white/20 hover:bg-white/10 rounded-full"
    >
      Log Out
    </button>
  );
}
