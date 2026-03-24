import { Sparkles, Trophy } from "lucide-react";

export function Icon() {
  return (
    <span className="inline-flex items-center gap-1.5 text-trophyGold" aria-hidden>
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-trophyGold/20 bg-trophyGold/10">
        <Trophy className="h-3.5 w-3.5" strokeWidth={2.2} />
      </span>
      <Sparkles className="h-3.5 w-3.5 text-trophyGold" strokeWidth={2.2} />
    </span>
  );
}
