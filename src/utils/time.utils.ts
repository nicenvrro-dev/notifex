/**
 * Returns a human-friendly relative time (e.g., "3 mins ago").
 * Falls back to formatted date if older than 1 week.
 */
export function formatRelativeTime(date: Date | string): string {
  const now = Date.now();
  const target = typeof date === "string" ? new Date(date).getTime() : date.getTime();

  const diff = now - target;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);

  if (seconds < 5) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(target).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric"
  });
}
