import { sql } from "@/lib/db";
import type { ContactMessage } from "@/lib/types";
import MessageRow from "@/components/admin/MessageRow";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = (await sql`
    SELECT * FROM contact_messages ORDER BY created_at DESC
  `) as ContactMessage[];

  return (
    <div className="space-y-6">
      <section className="glass-card p-6 md:p-12">
        <h1 className="section-title text-white">Messages</h1>
        <p className="text-white/60 text-sm mt-2">{messages.length} total</p>
      </section>

      {messages.length === 0 ? (
        <section className="glass-card p-12 text-center text-white/60">
          No messages yet.
        </section>
      ) : (
        <section className="space-y-3">
          {messages.map((m) => (
            <MessageRow key={m.id} message={m} />
          ))}
        </section>
      )}
    </div>
  );
}
