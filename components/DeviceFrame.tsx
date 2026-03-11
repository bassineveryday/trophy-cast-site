import Image from "next/image";

type DeviceType = "phone" | "browser";

interface DeviceFrameProps {
  src: string;
  alt: string;
  type?: DeviceType;
  label?: string;
  className?: string;
}

export function DeviceFrame({ src, alt, type = "phone", label, className = "" }: DeviceFrameProps) {
  if (type === "browser") {
    return (
      <div className={`overflow-hidden rounded-xl border border-white/10 bg-deepPanel shadow-badge ${className}`}>
        {/* Browser title bar */}
        <div className="flex items-center gap-2 border-b border-white/5 bg-midnight/80 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
          <div className="ml-3 flex-1 rounded-md bg-white/5 px-3 py-1 text-xs text-copyMuted/50">
            trophycast.app
          </div>
        </div>
        {/* Screenshot */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-top" />
        </div>
        {label && (
          <div className="border-t border-white/5 bg-midnight/60 px-4 py-2">
            <p className="text-xs font-semibold text-copyLight">{label}</p>
          </div>
        )}
      </div>
    );
  }

  // Phone frame
  return (
    <div className={`overflow-hidden rounded-[2rem] border-2 border-white/10 bg-midnight shadow-badge ${className}`}>
      {/* Phone notch / status bar */}
      <div className="flex items-center justify-center bg-midnight py-2">
        <div className="h-1.5 w-16 rounded-full bg-white/15" />
      </div>
      {/* Screenshot */}
      <div className="relative aspect-[9/19] w-full overflow-hidden">
        <Image src={src} alt={alt} fill sizes="(max-width: 640px) 80vw, 280px" className="object-cover object-top" />
      </div>
      {/* Home indicator */}
      <div className="flex items-center justify-center bg-midnight py-2">
        <div className="h-1 w-24 rounded-full bg-white/10" />
      </div>
      {label && (
        <p className="bg-midnight px-4 pb-3 text-center text-xs font-semibold text-copyLight">{label}</p>
      )}
    </div>
  );
}
