export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-card p-12 h-32" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 h-40" />
        <div className="glass-card p-8 h-40" />
        <div className="glass-card p-8 h-40" />
      </div>
    </div>
  );
}
