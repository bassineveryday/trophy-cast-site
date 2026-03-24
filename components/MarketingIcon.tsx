import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Brain,
  Building2,
  ClipboardList,
  CloudSun,
  Fish,
  Flame,
  GraduationCap,
  Link2,
  MapPinned,
  MessageCircle,
  Mic,
  Moon,
  Search,
  Settings2,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  Thermometer,
  TrendingUp,
  Trophy,
  Users,
  Video,
  Wind,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  coach: Sparkles,
  "🎣": Fish,
  "🐟": Fish,
  "🏆": Trophy,
  "⚡": Zap,
  "✨": Sparkles,
  "🎙️": Mic,
  "🤝": Users,
  "🌦️": CloudSun,
  "🌤️": CloudSun,
  "🗺️": MapPinned,
  "🎯": Target,
  "🔥": Flame,
  "🎬": Video,
  "⚙️": Settings2,
  "💬": MessageCircle,
  "📊": BarChart3,
  "📈": TrendingUp,
  "📱": Smartphone,
  "🔗": Link2,
  "🔍": Search,
  "💨": Wind,
  "🌕": Moon,
  "🌡️": Thermometer,
  "📋": ClipboardList,
  "🧒": Users,
  "🎓": GraduationCap,
  "🏟️": Building2,
  "🔒": Shield,
  "🧠": Brain,
  "💻": Smartphone,
  "📸": Sparkles,
};

interface MarketingIconProps {
  emoji: string;
  className?: string;
  fallbackClassName?: string;
  strokeWidth?: number;
}

export function MarketingIcon({ emoji, className, fallbackClassName, strokeWidth = 2.2 }: MarketingIconProps) {
  const Icon = iconMap[emoji];

  if (!Icon) {
    return <span className={cn(fallbackClassName, className)} aria-hidden>{emoji}</span>;
  }

  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
}