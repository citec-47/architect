/**
 * Pick a Tailwind grid-cols class that fits N cards comfortably on desktop.
 * Mobile stays 1-up; sm/md uses 2-up; lg uses the natural count.
 *
 * Class strings are written out as literals (not interpolated) so Tailwind
 * picks them up during the static class scan.
 */
export function adaptiveGridCols(count: number): string {
  if (count <= 1) return "grid-cols-1 max-w-md mx-auto";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto";
  if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  if (count === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  // 5–6 cards: prefer a balanced 3-up grid.
  if (count === 5 || count === 6) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  // 7+ : pack as 4-up so rows don't get too wide.
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
}
