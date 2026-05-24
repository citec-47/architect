"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/app/admin/actions";

export default function DeleteProjectButton({ id, title }: { id: number; title: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!confirm(`Delete "${title}" and all its media? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteProject(id);
      router.refresh();
    });
  }

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="flex-1 px-3 py-2 border border-red-500/40 text-red-300 rounded-full hover:bg-red-500/10 tracking-widest uppercase disabled:opacity-50"
    >
      {pending ? "..." : "Delete"}
    </button>
  );
}
