import Image from "next/image";

interface ScreenshotItem {
  src: string;
  alt: string;
  label: string;
  comingSoon?: boolean;
}

interface ScreenshotGridProps {
  caption: string;
  images: ScreenshotItem[];
}

export function ScreenshotGrid({ caption, images }: ScreenshotGridProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-copyMuted">{caption}</p>
      <div className="grid gap-6 sm:grid-cols-2">
        {images.map((image) => (
          <figure
            key={image.src}
            className="section-surface relative overflow-hidden rounded-3xl border border-white/5 p-6 text-center"
          >
            {image.comingSoon && (
              <div className="absolute right-0 top-0 z-10 rounded-bl-xl bg-trophyGold px-3 py-1 text-xs font-bold uppercase tracking-wider text-midnight shadow-lg">
                Coming Soon
              </div>
            )}
            <div className="relative">
              <Image
                src={image.src}
                alt={image.alt}
                width={640}
                height={400}
                className={`mx-auto h-64 w-full rounded-2xl border border-white/5 bg-deepPanel object-cover ${
                  image.comingSoon ? "opacity-60 grayscale" : ""
                }`}
              />
              {image.comingSoon && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-midnight/80 px-4 py-2 backdrop-blur-sm">
                    <span className="text-sm font-medium text-trophyGold">In Development</span>
                  </div>
                </div>
              )}
            </div>
            <figcaption className="mt-4 text-sm text-copyMuted">{image.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
