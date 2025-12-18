import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionVariant = "plain" | "surface" | "accent";

interface SectionProps {
  id?: string;
  variant?: SectionVariant;
  className?: string;
  children: ReactNode;
}

const variantMap: Record<SectionVariant, string> = {
  plain: "",
  surface: "section-surface rounded-3xl p-10 lg:p-14",
  accent: "section-surface section-accent rounded-3xl p-10 lg:p-14",
};

export function Section({ id, variant = "plain", className, children }: SectionProps) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)}>
      <Container>
        <div className={cn("relative", variantMap[variant])}>{children}</div>
      </Container>
    </section>
  );
}
