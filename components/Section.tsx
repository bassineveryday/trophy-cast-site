import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionVariant = "plain" | "surface" | "surfaceLifted" | "accent";

interface SectionProps {
  id?: string;
  variant?: SectionVariant;
  className?: string;
  children: ReactNode;
}

const variantMap: Record<SectionVariant, string> = {
  plain: "",
  surface: "section-surface rounded-3xl p-4 lg:p-6",
  surfaceLifted: "section-surface-lifted rounded-3xl p-4 lg:p-6",
  accent: "section-surface section-accent rounded-3xl p-4 lg:p-6",
};

export function Section({ id, variant = "plain", className, children }: SectionProps) {
  return (
    <section id={id} className={cn("py-4 sm:py-6", className)}>
      <Container>
        <div className={cn("relative", variantMap[variant])}>{children}</div>
      </Container>
    </section>
  );
}
