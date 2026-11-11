import { cn } from "@/lib/utils";

/** Jemná kresba bylinky (šalvěj / rozmarýn) – dekorace sekcí. */
export function Sprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 220" fill="none" aria-hidden className={cn("text-primary", className)}>
      <path d="M60 215C60 150 58 90 66 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {[
        [62, 40, -1],
        [61, 62, 1],
        [60, 86, -1],
        [60, 110, 1],
        [60, 134, -1],
        [60, 158, 1],
        [60, 182, -1],
      ].map(([x, y, d], i) => (
        <path
          key={i}
          d={`M${x} ${y}c${d * 10} -14 ${d * 30} -20 ${d * 44} -18c${-d * 6} 14 ${-d * 24} 24 ${-d * 44} 18z`}
          stroke="currentColor"
          strokeWidth="1.2"
          fill="currentColor"
          fillOpacity={0.08}
        />
      ))}
    </svg>
  );
}

/** Malý lístek – použitý v logu a jako oddělovač. */
export function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("text-primary", className)}>
      <path d="M16 29c0-9 2-16 9-21-8 1-14 7-14 15 0 2 .5 4 1.5 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.5 18.5c-4.5-.5-8-3.5-9-8 4.5.5 8 3.5 9 8z" fill="currentColor" />
      <path d="M18.5 14c1-3.5 4-5.8 7.5-6.3-.6 3.5-3.6 6.3-7.5 6.3z" fill="hsl(var(--clay))" />
    </svg>
  );
}

export function Divider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-4 text-primary/60", className)} aria-hidden>
      <span className="h-px w-16 bg-current" />
      <LeafMark className="h-5 w-5" />
      <span className="h-px w-16 bg-current" />
    </div>
  );
}
