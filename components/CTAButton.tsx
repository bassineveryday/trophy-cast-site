import Link from "next/link";
import { cn } from "@/lib/utils";

type CTAButtonVariant = "primary" | "secondary" | "ghost";

interface CTAButtonProps {
  href: string;
  label: string;
  variant?: CTAButtonVariant;
  className?: string;
  small?: boolean;
}

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-heading font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variantClasses: Record<CTAButtonVariant, string> = {
  primary:
    "bg-trophyGold text-midnight hover:bg-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] focus-visible:outline-trophyGold px-8 py-4 text-base sm:text-lg font-bold tracking-wide",
  secondary:
    "bg-white/5 text-copyLight border border-white/10 hover:bg-white/10 hover:border-white/30 focus-visible:outline-copyLight px-8 py-4 text-base sm:text-lg backdrop-blur-sm",
  ghost:
    "text-copyLight/80 hover:text-copyLight focus-visible:outline-copyLight px-4 py-2 text-xs",
};

export function CTAButton({ href, label, variant = "primary", className, small }: CTAButtonProps) {
  return (
    <Link
      href={href}
      className={cn(baseClasses, variantClasses[variant], small && "px-4 py-2 text-sm", className)}
    >
      {label}
    </Link>
  );
}
