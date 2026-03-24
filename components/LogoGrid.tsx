import Image from "next/image";

interface LogoItem {
  name: string;
  src: string;
  width: number;
  height: number;
  panel?: "dark" | "light";
}

interface LogoGridProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: LogoItem[];
}

export function LogoGrid({ eyebrow, title, description, items }: LogoGridProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-trophyGold">{eyebrow}</p>
        ) : null}
        <div className="space-y-2">
          <h3 className="font-heading text-2xl text-copyLight sm:text-3xl">{title}</h3>
          {description ? <p className="max-w-3xl text-sm leading-6 text-copyMuted">{description}</p> : null}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.name}
            className={[
              "flex min-h-[116px] flex-col justify-between rounded-2xl border p-4 transition-transform duration-200 hover:-translate-y-0.5",
              item.panel === "light"
                ? "border-slate-200 bg-white/95 shadow-[0_12px_30px_rgba(5,8,10,0.08)]"
                : "border-white/5 bg-deepPanel/70",
            ].join(" ")}
          >
            <div className="flex min-h-[56px] items-center justify-center">
              <Image
                src={item.src}
                alt={item.name}
                width={item.width}
                height={item.height}
                className="h-12 w-auto object-contain sm:h-14"
              />
            </div>
            <p
              className={[
                "mt-4 text-center text-xs font-semibold uppercase tracking-[0.18em]",
                item.panel === "light" ? "text-slate-700" : "text-copyMuted",
              ].join(" ")}
            >
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}