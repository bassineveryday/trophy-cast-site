import Image from "next/image";
import { Container } from "@/components/Container";

export const metadata = {
  title: "SMS Consent & Program Details — Trophy Cast",
  description:
    "Public SMS program details for Trophy Cast, including the current in-app opt-in flow, message samples, HELP/STOP instructions, and privacy disclosures.",
};

const sampleMessages = [
  "Trophy Cast: Norton Lake tournament start time moved to 6AM due to weather. Msg & data rates may apply. Reply HELP for help, STOP to cancel.",
  "Trophy Cast [URGENT]: Tomorrow's Bartlett Lake tournament is cancelled. Check the app for details. Reply HELP for help, STOP to cancel.",
  "Trophy Cast: You're now opted in to club SMS alerts. Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to cancel.",
  "Trophy Cast: Reminder - Denver BassMasters monthly meeting this Wednesday at 7PM. Msg & data rates may apply. Reply HELP for help, STOP to cancel.",
  "Trophy Cast: Pairings are live for Chatfield Reservoir. Open the app to confirm your boat and partner. Msg & data rates may apply. Reply HELP for help, STOP to cancel.",
];

const consentSteps = [
  "A member signs in to Trophy Cast and opens Settings.",
  "The member opens Trust Center and sees SMS Notifications turned off by default.",
  "The member must have a valid mobile phone number on file before the toggle can be enabled.",
  "The member deliberately turns the SMS Notifications toggle on to opt in to transactional messages.",
  "The disclosure shown at the point of opt-in reads: \"Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to cancel.\"",
  "Immediately after enabling the toggle, the member receives a confirmation SMS: \"Trophy Cast: You're now opted in to club SMS alerts. Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to cancel.\"",
  "The member can opt out at any time by turning the toggle off or replying STOP to any Trophy Cast SMS.",
];

const programRules = [
  "Program name: Trophy Cast SMS Notifications.",
  "Audience: opted-in Denver BassMasters members using the Trophy Cast app.",
  "Use case: transactional club-management alerts only. No marketing campaigns.",
  "Frequency: message frequency varies based on club activity and typically ranges from 5 to 20 messages per month across all recipients.",
  "Support: reply HELP or email hello@trophycast.app.",
  "Opt out: reply STOP or disable SMS Notifications in Settings → Trust Center.",
];

export default function SmsConsentPage() {
  return (
    <div className="min-h-screen py-14">
      <Container>
        <div className="mx-auto max-w-5xl space-y-10 text-sm leading-relaxed text-copyMuted">
          <div className="space-y-4">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
              SMS Compliance
            </p>
            <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
              Trophy Cast SMS consent and program details
            </h1>
            <p className="max-w-3xl text-sm sm:text-base">
              This public page documents the Trophy Cast SMS Notifications program and mirrors the
              current in-app opt-in flow used for transactional club-management messages. It is
              intended to make the consent flow, disclosures, and sample content easy to verify.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-trophyGold/15 bg-deepPanel/60 p-6 space-y-5">
              <div>
                <p className="font-heading text-xs font-bold uppercase tracking-[0.28em] text-trophyGold">
                  Program Snapshot
                </p>
                <h2 className="mt-2 font-heading text-2xl font-extrabold text-white">
                  Trophy Cast SMS Notifications
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {programRules.map((rule) => (
                  <div
                    key={rule}
                    className="rounded-2xl border border-white/8 bg-midnight/55 p-4 text-sm text-copyLight"
                  >
                    {rule}
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-trophyGold/15 bg-trophyGold/6 p-4">
                <p className="font-semibold text-copyLight">Privacy and consent statement</p>
                <p className="mt-2">
                  Text messaging originator opt-in data and consent will not be shared with any
                  third parties or affiliates for marketing or promotional purposes. Trophy Cast
                  uses service providers only to deliver the transactional messages a member has
                  explicitly asked to receive.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="/privacy" className="text-trophyGold hover:underline">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-trophyGold hover:underline">
                  Terms of Service
                </a>
                <a href="mailto:hello@trophycast.app" className="text-trophyGold hover:underline">
                  hello@trophycast.app
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/8 bg-liftedPanel/45 p-6 space-y-4">
              <p className="font-heading text-xs font-bold uppercase tracking-[0.28em] text-trophyGold">
                Consent Rules
              </p>
              <ul className="space-y-3">
                <li className="rounded-2xl border border-white/8 bg-midnight/50 p-4 text-copyLight">
                  SMS consent is optional and not required to create an account or join a tournament.
                </li>
                <li className="rounded-2xl border border-white/8 bg-midnight/50 p-4 text-copyLight">
                  The toggle is off by default until the member deliberately enables it.
                </li>
                <li className="rounded-2xl border border-white/8 bg-midnight/50 p-4 text-copyLight">
                  A valid phone number must be on the member profile before SMS can be enabled.
                </li>
                <li className="rounded-2xl border border-white/8 bg-midnight/50 p-4 text-copyLight">
                  Members can opt out at any time with STOP or by disabling the setting in the app.
                </li>
              </ul>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-4 rounded-3xl border border-white/8 bg-deepPanel/55 p-6">
              <p className="font-heading text-xs font-bold uppercase tracking-[0.28em] text-trophyGold">
                Current In-App Flow
              </p>
              <h2 className="font-heading text-2xl font-extrabold text-white">
                Trust Center SMS opt-in path
              </h2>
              <ol className="space-y-3">
                {consentSteps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-trophyGold/20 text-xs font-bold text-trophyGold">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="rounded-2xl border border-trophyGold/15 bg-trophyGold/6 p-4">
                <p className="font-semibold text-copyLight">What the member sees when consenting</p>
                <p className="mt-2">
                  The Trust Center screen clearly identifies SMS Notifications, the member chooses to
                  enable the toggle, and the disclosure states: &ldquo;Msg frequency varies. Msg &amp; data
                  rates may apply. Reply HELP for help, STOP to cancel.&rdquo; Immediately after enabling,
                  the member receives an opt-in confirmation SMS to their phone.
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-trophyGold/18 bg-midnight/80 p-5 shadow-glow">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#102230] shadow-2xl">
                <Image
                  src="/screenshots/trust-center-sms-off.png"
                  alt="Live Trophy Cast Trust Center screenshot showing the SMS Notifications toggle in the OFF position by default, with the disclosure text visible before consent is given."
                  width={1400}
                  height={500}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-xs leading-relaxed text-copyMuted">
                Screenshot from the live Trophy Cast app. The SMS Notifications toggle is OFF by
                default, the disclosure text is visible at the point of consent, and SMS opt-in is
                separate from account creation, tournament registration, or any other agreement.
              </p>
            </div>
          </div>

          {/* Video walkthrough */}
          <div className="space-y-4 rounded-3xl border border-white/8 bg-deepPanel/55 p-6">
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.28em] text-trophyGold">
                Video Walkthrough
              </p>
              <h2 className="mt-2 font-heading text-2xl font-extrabold text-white">
                SMS toggle — on and off
              </h2>
              <p className="mt-2 text-sm text-copyMuted">
                Screen recording showing a member navigating to Settings → Trust Center and turning the SMS Notifications toggle on and off.
              </p>
            </div>
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/eXvDL8Rt2Cs"
                title="Trophy Cast Trust Center — SMS Notifications toggle walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          <div className="space-y-5 rounded-3xl border border-white/8 bg-deepPanel/50 p-6">
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.28em] text-trophyGold">
                Exact Disclosure Copy
              </p>
              <h2 className="mt-2 font-heading text-2xl font-extrabold text-white">
                Consent language and message samples
              </h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-midnight/55 p-5">
                <p className="font-semibold text-copyLight">Core disclosure language</p>
                <div className="mt-3 space-y-3 text-sm text-copyMuted">
                  <p>
                    Message frequency varies based on club activity. Message and data rates may
                    apply.
                  </p>
                  <p>
                    For help, reply <strong className="text-copyLight">HELP</strong> or email{" "}
                    <a href="mailto:hello@trophycast.app" className="text-trophyGold hover:underline">
                      hello@trophycast.app
                    </a>
                    .
                  </p>
                  <p>
                    To opt out, reply <strong className="text-copyLight">STOP</strong> or turn SMS
                    Notifications off inside Settings → Trust Center.
                  </p>
                  <p>Carriers are not liable for delayed or undelivered messages.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-trophyGold/15 bg-trophyGold/6 p-5">
                <p className="font-semibold text-copyLight">Opt-in confirmation message</p>
                <p className="mt-2 text-sm text-copyMuted">
                  Every member who enables SMS Notifications receives this confirmation immediately
                  at the moment they turn the toggle on:
                </p>
                <div className="mt-3 rounded-xl border border-white/8 bg-white/5 p-3 text-sm text-copyLight font-mono">
                  Trophy Cast: You&rsquo;re now opted in to club SMS alerts. Msg frequency varies. Msg &amp; data rates may apply. Reply HELP for help, STOP to cancel.
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-midnight/55 p-5">
                <p className="font-semibold text-copyLight">Campaign sample messages</p>
                <p className="mt-2 text-sm text-copyMuted">
                  These examples match the wording used for campaign verification.
                </p>
                <ul className="mt-3 space-y-3 text-sm">
                  {sampleMessages.map((message) => (
                    <li key={message} className="rounded-xl border border-white/8 bg-white/5 p-3 text-copyLight">
                      {message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-5 rounded-3xl border border-white/8 bg-liftedPanel/40 p-6">
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.28em] text-trophyGold">
                Live App Context
              </p>
              <h2 className="mt-2 font-heading text-2xl font-extrabold text-white">
                Additional public proof that Trophy Cast is a live club-management app
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { src: "/screenshots/home-dashboard.png", title: "Home dashboard" },
                { src: "/screenshots/tc-coach.png", title: "TC Coach" },
                { src: "/screenshots/clubhouse.png", title: "Club operations" },
              ].map((image) => (
                <div key={image.src} className="overflow-hidden rounded-2xl border border-white/8 bg-midnight/50">
                  <div className="relative h-64">
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <p className="border-t border-white/8 px-4 py-3 text-sm font-semibold text-copyLight">
                    {image.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}