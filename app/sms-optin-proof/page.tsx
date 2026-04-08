export const metadata = {
  title: "SMS Opt-In Screen — Trophy Cast",
  description:
    "Public reference page showing the exact Trophy Cast in-app SMS opt-in screen used for A2P 10DLC campaign verification.",
};

export default function SmsOptinProofPage() {
  return (
    <div className="min-h-screen bg-[#0a1520] flex flex-col items-center justify-start px-4 py-10 gap-10">

      {/* Header */}
      <div className="w-full max-w-xl text-center space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A646]">
          A2P 10DLC Opt-In Verification
        </p>
        <h1 className="text-2xl font-extrabold text-white">
          Trophy Cast — In-App SMS Opt-In Screen
        </h1>
        <p className="text-sm text-[#94a3b8]">
          This page is a public reference showing the exact opt-in UI Trophy Cast
          members see inside the app at{" "}
          <strong className="text-white">
            Settings → Trust Center → SMS Notifications
          </strong>
          . The toggle is <strong className="text-white">OFF by default</strong>.
          Consent is standalone and not bundled with any other agreement.
        </p>
      </div>

      {/* Phone mockup */}
      <div className="w-full max-w-sm rounded-[2rem] border border-white/15 bg-[#0d1a25] shadow-2xl overflow-hidden">

        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-xs font-semibold text-white">9:41</span>
          <span className="text-xs text-[#94a3b8]">●●●</span>
        </div>

        {/* Nav header */}
        <div className="flex items-center gap-3 px-5 pb-3 border-b border-white/8">
          <span className="text-[#C9A646] text-sm">←</span>
          <span className="text-sm font-bold text-white">Trust Center</span>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">

          <p className="text-xs text-[#94a3b8]">
            Your preferences are saved to your account.
          </p>

          {/* TC Coach card */}
          <div className="rounded-xl border border-white/8 bg-[#132633] p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
              TC Coach consent
            </p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">Allow TC Coach features</p>
              <div className="flex h-7 w-12 items-center justify-end rounded-full bg-[#C9A646] px-1">
                <div className="h-5 w-5 rounded-full bg-white shadow" />
              </div>
            </div>
          </div>

          {/* SMS card — this is the CTA */}
          <div className="rounded-xl border border-[#C9A646]/30 bg-[#132633] p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
              SMS Notifications
            </p>

            {/* Toggle row — OFF by default */}
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">Enable SMS alerts</p>
              {/* Toggle shown in OFF state */}
              <div className="flex h-7 w-12 items-center justify-start rounded-full bg-white/15 px-1">
                <div className="h-5 w-5 rounded-full bg-white/70 shadow" />
              </div>
            </div>

            {/* Disclosure text shown at point of opt-in */}
            <p className="text-xs leading-relaxed text-[#94a3b8]">
              Texts sent to your phone number on file.{" "}
              <strong className="text-white">Msg frequency varies.</strong>{" "}
              Msg &amp; data rates may apply.{" "}
              Reply <strong className="text-white">HELP</strong> for help,{" "}
              <strong className="text-white">STOP</strong> to cancel.
            </p>

            <a
              href="https://trophycast.app/privacy"
              className="block text-xs font-semibold text-[#C9A646] underline underline-offset-2"
            >
              View Privacy Policy →
            </a>
          </div>

          <p className="text-xs text-[#94a3b8]">
            Users must have a valid phone number on their profile before the SMS
            toggle can be enabled.
          </p>
        </div>
      </div>

      {/* Compliance summary */}
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0d1a25] p-5 space-y-4 text-sm text-[#94a3b8]">
        <p className="font-bold text-white text-base">Program details shown at time of opt-in</p>
        <ul className="space-y-2">
          <li>
            <strong className="text-white">Program:</strong> Trophy Cast SMS Notifications
          </li>
          <li>
            <strong className="text-white">Sender:</strong> Trophy Cast (Denver BassMasters club management)
          </li>
          <li>
            <strong className="text-white">Opt-in method:</strong> In-app toggle at Settings → Trust Center → SMS Notifications
          </li>
          <li>
            <strong className="text-white">Toggle default:</strong> OFF — member must deliberately enable
          </li>
          <li>
            <strong className="text-white">Consent bundling:</strong> Not bundled with account creation, tournament registration, or any other agreement
          </li>
          <li>
            <strong className="text-white">Disclosure shown at opt-in:</strong> &ldquo;Msg frequency varies. Msg &amp; data rates may apply. Reply HELP for help, STOP to cancel.&rdquo;
          </li>
          <li>
            <strong className="text-white">Opt-in confirmation SMS sent immediately:</strong> &ldquo;Trophy Cast: You&rsquo;re now opted in to club SMS alerts. Msg frequency varies. Msg &amp; data rates may apply. Reply HELP for help, STOP to cancel.&rdquo;
          </li>
          <li>
            <strong className="text-white">Message frequency:</strong> Varies based on club activity, typically 5–20 messages/month across all recipients
          </li>
          <li>
            <strong className="text-white">Opt-out:</strong> Reply STOP to any message, or disable toggle in Settings → Trust Center
          </li>
          <li>
            <strong className="text-white">Support:</strong> Reply HELP or email{" "}
            <a href="mailto:hello@trophycast.app" className="text-[#C9A646] underline">
              hello@trophycast.app
            </a>
          </li>
        </ul>
        <div className="pt-2 border-t border-white/8 flex flex-wrap gap-4 text-xs">
          <a href="https://trophycast.app/privacy" className="text-[#C9A646] underline">Privacy Policy</a>
          <a href="https://trophycast.app/terms" className="text-[#C9A646] underline">Terms of Service</a>
          <a href="https://trophycast.app/sms-consent" className="text-[#C9A646] underline">Full SMS Program Details</a>
        </div>
      </div>

    </div>
  );
}
