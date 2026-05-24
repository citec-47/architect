"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markMessageRead, deleteMessage } from "@/app/admin/actions";
import type { ContactMessage } from "@/lib/types";

export default function MessageRow({ message }: { message: ContactMessage }) {
  const router = useRouter();
  const [open, setOpen] = useState(!message.read);
  const [pending, startTransition] = useTransition();

  function toggleRead() {
    startTransition(async () => {
      await markMessageRead(message.id, !message.read);
      router.refresh();
    });
  }

  function onDelete() {
    if (!confirm(`Delete message from ${message.name}?`)) return;
    startTransition(async () => {
      await deleteMessage(message.id);
      router.refresh();
    });
  }

  return (
    <article className={`glass-card p-5 ${message.read ? "opacity-70" : ""}`}>
      <header className="flex items-center justify-between gap-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          {!message.read && <span className="inline-block w-2 h-2 bg-amber-300 rounded-full" />}
          <div>
            <div className="text-white font-semibold">{message.name}</div>
            <div className="text-white/55 text-xs">{message.email}</div>
          </div>
        </div>
        <div className="text-white/45 text-xs">
          {new Date(message.created_at).toLocaleString()}
        </div>
      </header>
      {open && (
        <>
          <p className="text-white/85 text-sm mt-4 whitespace-pre-wrap">{message.message}</p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={toggleRead}
              disabled={pending}
              className="px-4 py-2 text-xs tracking-widest uppercase border border-white/30 text-white rounded-full hover:bg-white/10 disabled:opacity-50"
            >
              {message.read ? "Mark Unread" : "Mark Read"}
            </button>
            <a
              href={`mailto:${message.email}?subject=Re: your enquiry`}
              className="px-4 py-2 text-xs tracking-widest uppercase border border-white/30 text-white rounded-full hover:bg-white/10"
            >
              Reply
            </a>
            <button
              onClick={onDelete}
              disabled={pending}
              className="px-4 py-2 text-xs tracking-widest uppercase border border-red-500/40 text-red-300 rounded-full hover:bg-red-500/10 disabled:opacity-50 ml-auto"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </article>
  );
}
