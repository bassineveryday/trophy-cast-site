import { buildMailtoHref } from "@/lib/utils";
import { CTAButton } from "./CTAButton";

interface WaitlistFormProps {
  waitlist: {
    email: string;
    subject: string;
    body: string;
    primaryCta: string;
  };
  message: string;
}

export function WaitlistForm({ waitlist, message }: WaitlistFormProps) {
  const mailtoHref = buildMailtoHref(waitlist);

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-deepPanel/80 p-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-copyMuted">{message}</p>
      <CTAButton href={mailtoHref} label={waitlist.primaryCta} variant="primary" />
    </div>
  );
}
