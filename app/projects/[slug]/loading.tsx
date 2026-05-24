export default function Loading() {
  return (
    <main className="min-h-screen px-3 sm:px-4 md:px-8 py-4 md:py-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="relative min-h-[70vh] md:min-h-[80vh] w-full rounded-2xl md:rounded-3xl bg-[var(--bg-card)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse" />
        </div>
        <div className="glass-card p-5 md:p-8 animate-pulse h-24" />
        <div className="glass-card p-5 md:p-12 animate-pulse h-64" />
      </div>
    </main>
  );
}
