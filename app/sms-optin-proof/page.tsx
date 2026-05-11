import Image from "next/image";

export const metadata = {
  title: "SMS Opt-In Proof — Trophy Cast",
  description:
    "Public reference page showing both Trophy Cast SMS opt-in methods used for A2P 10DLC campaign verification: in-app toggle and officer-initiated welcome blast.",
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
          Trophy Cast — SMS Opt-In Methods
        </h1>
        <p className="text-sm text-[#94a3b8]">
          Trophy Cast supports two consent methods. <strong className="text-white">Method 1:</strong> Member
          enables SMS inside the app at{" "}
          <strong className="text-white">
            Settings → Trust Center → SMS Notifications
          </strong>
          . Toggle is <strong className="text-white">OFF by default</strong>. Consent is standalone and not
          bundled with any other agreement. <strong className="text-white">Method 2:</strong> Club officers
          send a one-time welcome SMS to existing members with a phone on file who have not yet opted
          in — the member replies <strong className="text-white">YES</strong> to enroll.
        </p>
      </div>

      {/* Live app screenshots — primary proof */}
      <div className="w-full max-w-2xl space-y-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A646] text-center">
          Method 1 — Screenshots from the live Trophy Cast app
        </p>

        {/* OFF state — default */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white text-center">
            Default state — SMS toggle is OFF
          </p>
          <div className="rounded-2xl border border-white/15 overflow-hidden shadow-2xl">
            <Image
              src="/screenshots/trust-center-sms-off.png"
              alt="Trophy Cast Trust Center screen showing SMS Notifications toggle in the OFF position by default, with disclosure text visible: Msg frequency varies. Msg and data rates may apply. Reply HELP for help, STOP to cancel."
              width={1400}
              height={500}
              className="w-full h-auto"
              priority
            />
          </div>
          <p className="text-xs text-[#94a3b8] text-center">
            The SMS Notifications toggle is OFF by default. The disclosure — &ldquo;Msg
            frequency varies. Msg &amp; data rates may apply. Reply HELP for help,
            STOP to cancel.&rdquo; — is visible before the member takes any action.
          </p>
        </div>

        {/* ON state — after opt-in */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white text-center">
            After member enables SMS — toggle is ON
          </p>
          <div className="rounded-2xl border border-white/15 overflow-hidden shadow-2xl">
            <Image
              src="/screenshots/trust-center-sms-on.png"
              alt="Trophy Cast Trust Center screen showing SMS Notifications toggle in the ON position after the member deliberately enabled it, with disclosure text and View Privacy Policy link visible."
              width={1400}
              height={200}
              className="w-full h-auto"
              priority
            />
          </div>
          <p className="text-xs text-[#94a3b8] text-center">
            After the member deliberately enables the toggle, a confirmation SMS is
            sent immediately: &ldquo;Trophy Cast: You&rsquo;re now opted in to club
            SMS alerts. Msg frequency varies. Msg &amp; data rates may apply. Reply
            HELP for help, STOP to cancel.&rdquo;
          </p>
        </div>
      </div>

      {/* Video walkthrough */}
      <div className="w-full max-w-xl space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A646] text-center">
          Method 1 — Video walkthrough
        </p>
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
          <iframe
            src="https://www.youtube.com/embed/eXvDL8Rt2Cs"
            title="Trophy Cast Trust Center — SMS Notifications toggle walkthrough"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <p className="text-xs text-[#94a3b8] text-center">
          Screen recording showing a member navigating to Settings → Trust Center and turning the SMS Notifications toggle on and off.
        </p>
      </div>

      {/* Method 2 — Welcome blast / YES reply */}
      <div className="w-full max-w-xl rounded-2xl border border-[#C9A646]/30 bg-[#0d1a25] p-5 space-y-4 text-sm text-[#94a3b8]">
        <p className="font-bold text-white text-base">Method 2 — Officer welcome blast (reply YES)</p>
        <p>
          Club officers may send a one-time welcome SMS to existing club members who have a phone
          number on file in Trophy Cast but have not yet opted in. The message invites the member
          to reply <strong className="text-white">YES</strong> to enroll in club alerts.
        </p>
        <ul className="space-y-2">
          <li>
            <strong className="text-white">Eligibility:</strong> Must be an existing member of an active club in Trophy Cast with a phone number on file and no prior STOP reply
          </li>
          <li>
            <strong className="text-white">Message sent to member:</strong> &ldquo;[Trophy Cast] [Club Name]: Club alerts are live! Reply YES to get tournament updates &amp; announcements by text. Visit trophycast.app to manage. Msg &amp; data rates may apply. Reply STOP to decline.&rdquo;
          </li>
          <li>
            <strong className="text-white">Opt-in action:</strong> Member replies YES
          </li>
          <li>
            <strong className="text-white">Confirmation sent immediately after YES:</strong> &ldquo;Trophy Cast: You&rsquo;re now opted in to club SMS alerts. Msg frequency varies. Msg &amp; data rates may apply. Reply HELP for help, STOP to cancel.&rdquo;
          </li>
          <li>
            <strong className="text-white">STOP protection:</strong> Members who previously replied STOP are permanently excluded from welcome blasts
          </li>
          <li>
            <strong className="text-white">Idempotency:</strong> Each phone number can only receive one welcome blast per club per 30 days
          </li>
          <li>
            <strong className="text-white">Opt-out:</strong> Reply STOP at any time
          </li>
        </ul>
      </div>

      {/* Compliance summary */}
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0d1a25] p-5 space-y-4 text-sm text-[#94a3b8]">
        <p className="font-bold text-white text-base">Program details shown at time of opt-in</p>
        <ul className="space-y-2">
          <li>
            <strong className="text-white">Program:</strong> Trophy Cast SMS Notifications
          </li>
          <li>
            <strong className="text-white">Sender:</strong> Trophy Cast (any active fishing club on the Trophy Cast platform)
          </li>
          <li>
            <strong className="text-white">Opt-in methods:</strong> (1) In-app toggle at Settings → Trust Center → SMS Notifications; (2) Reply YES to officer welcome blast
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
