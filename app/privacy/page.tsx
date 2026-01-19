export default function PrivacyPage() {
  return (
    <div className="space-y-8 pt-8 pb-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-ink">Privacy Policy</h1>
        <p className="text-sm text-muted">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-sm max-w-3xl space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">1. Information We Collect</h2>
          <p className="text-sm text-muted leading-relaxed">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted ml-4">
            <li>Account information (email address, password hash)</li>
            <li>Prompts and evaluations you create</li>
            <li>Usage data and interaction history</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">2. How We Use Your Information</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted ml-4">
              <li>Provide and maintain the service</li>
              <li>Store your prompt history and iterations</li>
              <li>Provide educational feedback and evaluations</li>
              <li>Improve our service (using aggregated, anonymized data only)</li>
            </ul>
            <p className="text-sm text-muted leading-relaxed">
              <strong className="text-ink">Important:</strong> We do NOT use your prompts, evaluations, or any user-generated 
              content to train, fine-tune, or improve AI models. Your data remains private and is used solely for providing 
              the educational service.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">3. Data Storage and Security</h2>
          <p className="text-sm text-muted leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information. 
            Passwords are hashed using industry-standard encryption. However, no method of transmission over the 
            Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">4. Data Sharing</h2>
          <p className="text-sm text-muted leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. We may share aggregated, 
            anonymized data for analytical purposes, but this data cannot be used to identify individual users.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">5. Your Rights</h2>
          <p className="text-sm text-muted leading-relaxed">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted ml-4">
            <li>Access your personal information</li>
            <li>Delete your account and associated data</li>
            <li>Export your prompt history</li>
            <li>Opt out of certain data collection practices</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">6. Cookies</h2>
          <p className="text-sm text-muted leading-relaxed">
            We use HTTP-only cookies to maintain your session and authenticate your account. These cookies are 
            essential for the service to function and are not used for tracking or advertising purposes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">7. Children's Privacy</h2>
          <p className="text-sm text-muted leading-relaxed">
            Our service is not intended for children under 13 years of age. We do not knowingly collect personal 
            information from children under 13.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">8. Changes to This Policy</h2>
          <p className="text-sm text-muted leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
            the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">9. Contact Us</h2>
          <p className="text-sm text-muted leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us through the appropriate channels.
          </p>
        </section>
      </div>
    </div>
  );
}
