import { Sparkles } from "lucide-react";

interface TCCoachBadgeProps {
  label?: string;
  className?: string;
}

export function TCCoachBadge({ label = "TC Coach", className = "" }: TCCoachBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-trophyGold/30 bg-trophyGold/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-trophyGold shadow-[0_0_16px_rgba(212,175,55,0.12)] ${className}`.trim()}
    >
      <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
      <span>{label}</span>
    </div>
  );
}