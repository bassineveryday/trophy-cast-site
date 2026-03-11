import Image from "next/image";

interface ScreenshotItem {
  src: string;
  alt: string;
  label: string;
  description?: string;
  category?: string;
  comingSoon?: boolean;
  featured?: boolean;
}

interface ScreenshotGridProps {
  caption: string;
  images: ScreenshotItem[];
}

function ScreenshotCard({ image, featured = false }: { image: ScreenshotItem; featured?: boolean }) {
  return (
    <figure className="card-hover group relative overflow-hidden rounded-2xl border border-white/10 bg-deepPanel shadow-badge">
      {image.category && (
        <div className="absolute left-3 top-3 z-10 rounded-full border border-trophyGold/25 bg-midnight/85 px-3 py-1 text-xs font-semibold text-trophyGold backdrop-blur-sm">
          {image.category}
        </div>
      )}
      {image.comingSoon && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-trophyGold px-3 py-1 text-xs font-bold text-midnight">
          Coming Soon
        </div>
      )}
      <div className={`relative w-full overflow-hidden ${featured ? "h-80" : "h-64"}`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, 50vw"}
          className={`object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] ${
            image.comingSoon ? "opacity-50 grayscale" : ""
          }`}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-midnight via-midnight/60 to-transparent px-4 pb-3 pt-12">
          <p className="font-heading text-sm font-bold text-white">{image.label}</p>
          {image.description && (
            <p className="mt-0.5 text-xs text-copyMuted">{image.description}</p>
          )}
        </div>
      </div>
    </figure>
  );
}

export function ScreenshotGrid({ caption, images }: ScreenshotGridProps) {
  const featured = images.filter((img) => img.featured);
  const rest = images.filter((img) => !img.featured);

  return (
    <div className="space-y-4">
      <p className="text-sm text-copyMuted">{caption}</p>
      {featured.length > 0 && (
        <div className={`grid gap-4 ${featured.length >= 2 ? "md:grid-cols-2" : ""}`}>
          {featured.map((image) => (
            <ScreenshotCard key={image.src} image={image} featured />
          ))}
        </div>
      )}
      {rest.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((image) => (
            <ScreenshotCard key={image.src} image={image} />
          ))}
        </div>
      )}
    </div>
  );
}
