"use client";

import { useState } from "react";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError(null);

    // Capture the form ref BEFORE the await — React nulls e.currentTarget
    // after async work, so calling .reset() later would throw.
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      message: form.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        formEl.reset();
        setState("sent");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? "Something went wrong, please try again.");
        setState("error");
      }
    } catch (err) {
      setError((err as Error).message || "Network error — please try again.");
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs tracking-widest uppercase text-white/45 block mb-2">
          Name
        </label>
        <input name="name" required placeholder="Your name" />
      </div>
      <div>
        <label className="text-xs tracking-widest uppercase text-white/45 block mb-2">
          Email
        </label>
        <input name="email" type="email" required placeholder="you@example.com" />
      </div>
      <div>
        <label className="text-xs tracking-widest uppercase text-white/45 block mb-2">
          Message
        </label>
        <textarea name="message" required rows={6} placeholder="Tell us about your project" />
      </div>

      <button
        type="submit"
        disabled={state === "sending"}
        className="px-8 py-3 bg-white text-slate-900 font-semibold tracking-widest text-xs uppercase rounded-full disabled:opacity-50"
      >
        {state === "sending" ? "Sending..." : "Send Message"}
      </button>

      {state === "sent" && (
        <p className="text-green-300 text-sm">Thanks — we'll be in touch shortly.</p>
      )}
      {state === "error" && error && (
        <p className="text-red-300 text-sm">{error}</p>
      )}
    </form>
  );
}
