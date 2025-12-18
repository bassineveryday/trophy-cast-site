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
    "bg-bass text-copyLight hover:bg-bass/90 focus-visible:outline-bass px-6 py-3 text-sm sm:text-base",
  secondary:
    "bg-transparent text-copyLight border border-copyLight/30 hover:border-trophyGold hover:text-trophyGold focus-visible:outline-copyLight px-6 py-3 text-sm sm:text-base",
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
