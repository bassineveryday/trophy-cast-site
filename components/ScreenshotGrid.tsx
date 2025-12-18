import Image from "next/image";

interface ScreenshotItem {
  src: string;
  alt: string;
  label: string;
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
            className="section-surface rounded-3xl border border-white/5 p-6 text-center"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={640}
              height={400}
              className="mx-auto h-64 w-full rounded-2xl border border-white/5 bg-deepPanel object-cover"
            />
            <figcaption className="mt-4 text-sm text-copyMuted">{image.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
