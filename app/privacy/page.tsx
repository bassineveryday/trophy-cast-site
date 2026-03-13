import { Container } from "@/components/Container";

export const metadata = {
  title: "Privacy Policy — Trophy Cast",
  description:
    "Trophy Cast Privacy Policy. Your data belongs to you. We never sell or share your personal information with third parties.",
};

export default function PrivacyPage() {
  return (
    <div className="py-14 min-h-screen">
      <Container>
        <div className="mx-auto max-w-3xl space-y-10 text-sm leading-relaxed text-copyMuted">

          {/* Header */}
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold mb-3">
              Legal
            </p>
            <h1 className="font-heading text-3xl font-extrabold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm">
              <strong className="text-copyLight">Effective Date:</strong> March 12, 2026
              &nbsp;·&nbsp;
              <strong className="text-copyLight">Operator:</strong> Trophy Cast, Inc.
              &nbsp;·&nbsp;
              <a href="mailto:hello@trophycast.app" className="text-trophyGold hover:underline">
                hello@trophycast.app
              </a>
            </p>
            <div className="mt-4 border-l-2 border-trophyGold/40 pl-4 italic">
              Trophy Cast is currently in beta. This Privacy Policy applies during the beta period
              and will be updated when we exit beta. Our core commitments — especially around data
              ownership and never selling your information — will not change.
            </div>
          </div>

          {/* Angler Intro */}
          <div className="rounded-2xl border border-trophyGold/20 bg-deepPanel/60 p-5 space-y-3">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-trophyGold">From the team</p>
            <p className="text-copyLight leading-relaxed">
              This app was built by a tournament angler who knows exactly what it costs when your practice gets out. We&rsquo;ve pre-fished the night before weigh-in. We know what it means to protect water. Your spots, your routes, your strategy — that&rsquo;s not our data to share. The Vault is Sealed.
            </p>
            <p className="text-sm text-copyMuted">
              The legal sections below say the same thing in terms lawyers approved. But the commitment above is the one we actually mean.
            </p>
          </div>

          {/* Short Version */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              The Short Version
            </h2>
            <ul className="space-y-2">
              {[
                "We never sell your personal information. Ever.",
                "We never share your email, phone number, name, or fishing data with third parties for marketing purposes.",
                "Your GPS locations and fishing spots stay inside your account.",
                "Your tournament prep, scouting marks, and private strategy are sealed in your vault — never shared with other users or contributed to any public map.",
                "Your catch patterns are never shared with other users without your explicit consent.",
                "TC Coach gets smarter from anonymized patterns (what conditions work, which lures are trending). It never learns where your spots are.",
                "You own your catch data. You can request deletion at any time.",
                "SMS alerts are opt-in only — you control whether you receive them.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-trophyGold shrink-0 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Your Vault */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              Your Vault
            </h2>
            <p className="mb-4">
              Some data in Trophy Cast is more sensitive than a password. We treat it that way.
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-copyLight mb-1">What&rsquo;s in the Vault</p>
                <p>
                  Your GPS coordinates, fishing spots, scouting marks, private notes, waypoint names, tournament prep, and the order you plan to fish your water. This is your private strategy — the product of your hours on the water. It never leaves your account.
                </p>
              </div>
              <div>
                <p className="font-semibold text-copyLight mb-1">The Vault is Sealed</p>
                <p>
                  Vault contents are never shared with other users, never contributed to any public fishing map, never sold, and never used in any way that exposes your location data. Full stop.
                </p>
              </div>
              <div>
                <p className="font-semibold text-copyLight mb-1">How TC Coach gets smarter without opening the Vault</p>
                <p>
                  TC Coach runs on two layers. Your Personal Coach sees your exact catches, conditions, and patterns — all private, sealed in your account. The platform layer learns from anonymized, aggregated signals: which lure categories are trending in a region, how pressure affects bite rates, which techniques work in fall turnover. No coordinates. No strategy. Never you individually. The platform learns what a laydown looks like. It never learns where yours is.
                </p>
              </div>
            </div>
          </div>

          {/* What We Collect */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              What We Collect
            </h2>
            <p className="mb-4">When you use Trophy Cast, we may collect:</p>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-copyLight mb-1">Account Information</p>
                <p>
                  Your name, email address, and phone number when you create an account or complete
                  onboarding.
                </p>
              </div>
              <div>
                <p className="font-semibold text-copyLight mb-1">Catch Data</p>
                <p>
                  Species, weight, GPS location, lure, technique, water conditions, photos, and
                  video notes that you voluntarily log in the app.
                </p>
              </div>
              <div>
                <p className="font-semibold text-copyLight mb-1">Tournament &amp; Club Data</p>
                <p>
                  Tournament registration, results, AOY standings, and club membership data —
                  entered by you or your club officers.
                </p>
              </div>
              <div>
                <p className="font-semibold text-copyLight mb-1">Anonymous Usage Data</p>
                <p>
                  Aggregated, non-personally-identifiable usage statistics collected via Vercel
                  Analytics. We use this solely to understand how the app is used so we can improve
                  it.
                </p>
              </div>
            </div>
          </div>

          {/* How We Use It */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              How We Use Your Information
            </h2>
            <ul className="space-y-2">
              <li>
                To power <strong className="text-copyLight">TC Coach</strong> — your personalized
                fishing coaching engine. Your patterns stay inside your account.
              </li>
              <li>
                To run tournament and club management features for your club.
              </li>
              <li>
                To send SMS alerts you have explicitly opted into (see SMS section below).
              </li>
              <li>
                To improve Trophy Cast using anonymized, aggregated insights — never in a way that
                identifies you personally.
              </li>
              <li>To respond to support requests when you contact us.</li>
            </ul>
          </div>

          {/* What We Never Do */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              What We Never Do
            </h2>
            <ul className="space-y-2">
              {[
                "Sell, rent, or trade your personal information to any third party.",
                "Share your email, phone number, name, or fishing data with third parties for advertising or marketing.",
                "Share your GPS coordinates or specific fishing locations outside your account.",
                "Build advertising profiles from your data.",
                "Share your individual catch patterns with other users without your explicit consent.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SMS */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              SMS Notifications
            </h2>
            <p className="mb-4">
              Trophy Cast may send transactional SMS messages to members who have opted in. These
              messages include tournament reminders, cancellation notices, and urgent club
              announcements. We never send marketing SMS messages.
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-copyLight mb-1">How to Opt In</p>
                <p>
                  Open the app and go to{" "}
                  <strong className="text-copyLight">
                    Settings → Trust Center → SMS Notifications
                  </strong>
                  . Toggle SMS Notifications on. By enabling this setting, you consent to receive
                  transactional SMS messages from Trophy Cast.
                </p>
              </div>
              <div>
                <p className="font-semibold text-copyLight mb-1">How to Opt Out</p>
                <p>
                  Toggle SMS Notifications off in{" "}
                  <strong className="text-copyLight">Settings → Trust Center</strong> at any time,
                  or reply <strong className="text-copyLight">STOP</strong> to any Trophy Cast
                  message. You will receive one confirmation and no further messages.
                </p>
              </div>
              <div>
                <p className="font-semibold text-copyLight mb-1">Message Frequency &amp; Rates</p>
                <p>
                  Message frequency varies based on club activity. Message and data rates may apply.
                  For help, reply <strong className="text-copyLight">HELP</strong> or contact{" "}
                  <a href="mailto:hello@trophycast.app" className="text-trophyGold hover:underline">
                    hello@trophycast.app
                  </a>
                  .
                </p>
              </div>
              <div>
                <p className="font-semibold text-copyLight mb-1">No Sharing</p>
                <p>
                  Your phone number is never shared with any third party for marketing purposes.
                  It is used solely to deliver transactional messages you have opted into.
                </p>
              </div>
            </div>
          </div>

          {/* Data Storage */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              Data Storage &amp; Security
            </h2>
            <p>
              Your data is stored securely via{" "}
              <strong className="text-copyLight">Supabase</strong> on servers located in the United
              States. We use industry-standard encryption for data in transit and at rest. We do not
              transfer your personal data outside the United States.
            </p>
            <p className="mt-3">
              Row-level security (RLS) policies ensure that each user can only access their own
              data. Club data is scoped to club members only.
            </p>
          </div>

          {/* Beta */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              Beta Program
            </h2>
            <p>
              Trophy Cast is currently in private beta. During this period, the app is available by
              invitation to club members and early adopters. We protect your data with the same
              standards as a production service. In rare cases where data maintenance requires
              migration or reset, we will provide advance notice.
            </p>
            <p className="mt-3">
              Beta participation is voluntary. You may request account deletion at any time (see
              below).
            </p>
          </div>

          {/* Your Rights */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              Your Rights &amp; Data Deletion
            </h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-trophyGold shrink-0 mt-0.5">→</span>
                <span>
                  <strong className="text-copyLight">Access</strong> the personal information we
                  hold about you.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-trophyGold shrink-0 mt-0.5">→</span>
                <span>
                  <strong className="text-copyLight">Correct</strong> inaccurate data in your
                  profile.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-trophyGold shrink-0 mt-0.5">→</span>
                <span>
                  <strong className="text-copyLight">Delete</strong> your account and all associated
                  data. We will process deletion requests immediately upon verification.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-trophyGold shrink-0 mt-0.5">→</span>
                <span>
                  <strong className="text-copyLight">Opt out</strong> of analytics, AI coaching
                  features, or SMS notifications at any time via Settings → Trust Center.
                </span>
              </li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, email{" "}
              <a href="mailto:hello@trophycast.app" className="text-trophyGold hover:underline">
                hello@trophycast.app
              </a>
              .
            </p>
          </div>

          {/* Third Party */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              Third-Party Services
            </h2>
            <p>
              Trophy Cast uses the following third-party services to operate. Each is bound by its
              own privacy policy:
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <strong className="text-copyLight">Supabase</strong> — database and authentication
                (supabase.com)
              </li>
              <li>
                <strong className="text-copyLight">Vercel</strong> — hosting and anonymous analytics
                (vercel.com)
              </li>
              <li>
                <strong className="text-copyLight">Twilio</strong> — transactional SMS delivery to
                opted-in members (twilio.com)
              </li>
              <li>
                <strong className="text-copyLight">OpenAI / Anthropic</strong> — powers TC Coach
                AI responses using anonymized prompts (no personal identifiers sent)
              </li>
            </ul>
            <p className="mt-3">
              We do not use advertising networks, sell data to data brokers, or integrate with social
              media tracking platforms.
            </p>
          </div>

          {/* Changes */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              Changes to This Policy
            </h2>
            <p>
              We will update this Privacy Policy as Trophy Cast evolves, especially as we exit beta.
              Significant changes will be communicated via in-app notice or email. Continued use of
              Trophy Cast after changes constitutes acceptance.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">Contact</h2>
            <p>
              Questions about this Privacy Policy? Contact us at{" "}
              <a href="mailto:hello@trophycast.app" className="text-trophyGold hover:underline">
                hello@trophycast.app
              </a>
              .
            </p>
            <p className="mt-2 text-xs text-copyMuted">
              © 2026 Trophy Cast, Inc. All rights reserved.
            </p>
          </div>

        </div>
      </Container>
    </div>
  );
}
