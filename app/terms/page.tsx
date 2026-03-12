import { Container } from "@/components/Container";

export const metadata = {
  title: "Terms of Service — Trophy Cast",
  description:
    "Trophy Cast Terms of Service. Your rights, our commitments, and what we both agree to during the Trophy Cast beta.",
};

export default function TermsPage() {
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
              Terms of Service
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
              Trophy Cast is currently in beta. These Terms of Service apply during the beta period
              and will be updated when we exit beta. By using Trophy Cast, you agree to these terms.
            </div>
          </div>

          {/* Acceptance */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account or using Trophy Cast (the &ldquo;Service&rdquo;), you agree to
              these Terms of Service and our{" "}
              <a href="/privacy" className="text-trophyGold hover:underline">
                Privacy Policy
              </a>
              . If you do not agree, please do not use the Service.
            </p>
            <p className="mt-3">
              The Service is operated by Trophy Cast, Inc. These terms constitute a binding agreement
              between you and Trophy Cast, Inc.
            </p>
          </div>

          {/* Beta */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              2. Beta Program
            </h2>
            <p className="mb-4">
              Trophy Cast is currently in private beta. Beta access is by invitation only, currently
              limited to fishing club members and early adopters.
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-copyLight mb-2">Our commitments to you during beta:</p>
                <ul className="space-y-2">
                  {[
                    "We will protect your data with the same diligence as a production service.",
                    "We will notify you before any significant data migration or reset.",
                    "We will never sell or share your personal information with third parties.",
                    "Beta access is free. We will give reasonable advance notice before introducing paid tiers.",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-trophyGold shrink-0 mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-copyLight mb-2">What we ask of you during beta:</p>
                <ul className="space-y-2">
                  {[
                    "Please don't publicly share screenshots of unreleased features. We're building in the open with our early community — but things change quickly and out-of-context previews can mislead.",
                    "If you find a bug or security issue, please report it to hello@trophycast.app rather than exploiting it or sharing it publicly.",
                    "Don't share your login credentials or beta access link with others.",
                    "Understand that features may change, be removed, or be redesigned during beta. Your feedback helps — we read every message.",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-copyMuted shrink-0 mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Account */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              3. Your Account
            </h2>
            <ul className="space-y-3">
              <li>
                You are responsible for maintaining the confidentiality of your account credentials.
              </li>
              <li>
                You must provide accurate information when creating your account. Impersonating
                another person or using a false identity is prohibited.
              </li>
              <li>
                You must be at least 13 years old to use Trophy Cast. If you are under 18, you
                confirm that you have parental consent.
              </li>
              <li>
                You are responsible for all activity that occurs under your account.
              </li>
              <li>
                Notify us immediately at{" "}
                <a href="mailto:hello@trophycast.app" className="text-trophyGold hover:underline">
                  hello@trophycast.app
                </a>{" "}
                if you believe your account has been compromised.
              </li>
            </ul>
          </div>

          {/* Data Ownership */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              4. Data Ownership
            </h2>
            <p className="mb-4">
              <strong className="text-copyLight">You own your catch data.</strong> The fish you log,
              the spots you fish, the patterns you build — that&rsquo;s yours.
            </p>
            <ul className="space-y-3">
              <li>
                By using the Service, you grant Trophy Cast, Inc. a limited, non-exclusive license
                to store, process, and use your data solely to operate and improve the Service.
              </li>
              <li>
                We may use anonymized, aggregated fishing insights (e.g., &ldquo;green pumpkin is
                trending in Colorado&rdquo;) to power regional TC Coach recommendations. This data
                never identifies you individually.
              </li>
              <li>
                If you delete your account, your personal data is deleted immediately. Anonymized
                aggregate contributions may remain in aggregate models but cannot be traced back to
                you.
              </li>
              <li>
                Tournament results and club records may be retained by your club after account
                deletion, as they are part of club records, not personal accounts.
              </li>
            </ul>
          </div>

          {/* Acceptable Use */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              5. Acceptable Use
            </h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="space-y-2">
              {[
                "Use the Service for any unlawful purpose.",
                "Upload false, misleading, or fraudulent catch data in club tournaments.",
                "Attempt to gain unauthorized access to other users' accounts or data.",
                "Reverse engineer, decompile, or attempt to extract source code from the app.",
                "Use automated bots or scrapers against the Service.",
                "Interfere with or disrupt the integrity of the Service.",
                "Post abusive, harassing, or hateful content in any messaging or social features.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Violations may result in immediate account suspension. Serious violations will be
              reported to the appropriate authorities.
            </p>
          </div>

          {/* SMS */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              6. SMS Notifications
            </h2>
            <p className="mb-3">
              If you enable SMS Notifications (Settings → Trust Center → SMS Notifications), you
              consent to receive transactional SMS messages from Trophy Cast. These messages are
              limited to:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex gap-2">
                <span className="text-trophyGold shrink-0 mt-0.5">·</span>
                <span>Tournament reminders and cancellation notices</span>
              </li>
              <li className="flex gap-2">
                <span className="text-trophyGold shrink-0 mt-0.5">·</span>
                <span>Urgent club announcements</span>
              </li>
              <li className="flex gap-2">
                <span className="text-trophyGold shrink-0 mt-0.5">·</span>
                <span>Direct messages within the app (if enabled)</span>
              </li>
            </ul>
            <p>
              We never send marketing SMS messages. Message frequency varies based on tournament
              schedules and club activity. Message and data rates may apply. To opt out, toggle SMS
              Notifications off in Settings → Trust Center, or reply{" "}
              <strong className="text-copyLight">STOP</strong> to any Trophy Cast message. Reply{" "}
              <strong className="text-copyLight">HELP</strong> for support or contact us at{" "}
              hello@trophycast.app.
            </p>
          </div>

          {/* TC Coach / AI */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              7. TC Coach &amp; Fishing Advice Disclaimer
            </h2>
            <p>
              TC Coach recommendations are provided for educational and informational purposes only.
              They are not guarantees of fishing success and should not be treated as professional
              advice. Trophy Cast is not responsible for:
            </p>
            <ul className="mt-3 space-y-2">
              {[
                "Fishing outcomes or catch results based on TC Coach recommendations.",
                "Safety decisions made on the water.",
                "Decisions made based on weather, conditions, or solunar data provided by the app.",
                "Discrepancies in tournament results or AOY standings managed by club officers.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-copyMuted shrink-0 mt-0.5">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Tournament result disputes should be directed to your club officers, not Trophy Cast.
            </p>
          </div>

          {/* IP */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              8. Intellectual Property
            </h2>
            <p>
              The Trophy Cast name, TC Coach brand, logo, app design, and all original content
              are the property of Trophy Cast, Inc. and protected by applicable intellectual
              property laws.
            </p>
            <p className="mt-3">
              Your fishing photos, catch notes, and personal data remain yours. You grant us only
              the limited license described in Section 4.
            </p>
          </div>

          {/* Service Availability */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              9. Service Availability
            </h2>
            <p>
              We aim for high availability but make no guarantees during beta. We reserve the right
              to modify, suspend, or discontinue any feature at any time. For significant changes,
              we will provide reasonable in-app or email notice.
            </p>
          </div>

          {/* Liability */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              10. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Trophy Cast, Inc. shall not be liable for any
              indirect, incidental, special, or consequential damages, including but not limited to
              loss of data, loss of fishing records, or missed tournament notifications.
            </p>
            <p className="mt-3">
              Our total liability to you for any claim arising from the use of the Service shall not
              exceed the amount you paid for the Service in the preceding 12 months (currently $0
              during beta).
            </p>
          </div>

          {/* Governing Law */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              11. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of the State of Colorado, without regard to
              conflict-of-law principles. Any disputes shall be resolved in the courts of Colorado.
            </p>
          </div>

          {/* Changes */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">
              12. Changes to These Terms
            </h2>
            <p>
              We will update these Terms as Trophy Cast evolves, especially as we exit beta.
              Significant changes will be communicated via in-app notice or email at least 7 days
              before they take effect. Continued use of the Service after changes constitutes
              acceptance.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-heading text-lg font-bold text-trophyGold mb-3">13. Contact</h2>
            <p>
              Questions about these Terms? Contact us at{" "}
              <a href="mailto:hello@trophycast.app" className="text-trophyGold hover:underline">
                hello@trophycast.app
              </a>
              .
            </p>
            <p className="mt-4">
              <a href="/privacy" className="text-trophyGold hover:underline">
                ← View Privacy Policy
              </a>
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
