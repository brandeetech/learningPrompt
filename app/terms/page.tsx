export default function TermsPage() {
  return (
    <div className="space-y-8 pt-8 pb-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-ink">Terms and Conditions</h1>
        <p className="text-sm text-muted">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-sm max-w-3xl space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">1. Acceptance of Terms</h2>
          <p className="text-sm text-muted leading-relaxed">
            By accessing and using AskRight, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">2. Use of Service</h2>
          <p className="text-sm text-muted leading-relaxed">
            AskRight is an educational platform designed to help users learn and improve their prompt engineering skills. 
            You agree to use the service only for lawful purposes and in accordance with these Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">3. Data Usage and Privacy</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted leading-relaxed">
              <strong className="text-ink">User Data Will Not Be Used for Training:</strong> We explicitly state that any prompts, 
              evaluations, outputs, or other user-generated content submitted through AskRight will <strong className="text-ink">NOT</strong> be 
              used to train, fine-tune, or improve any AI models, including but not limited to language models, evaluation models, 
              or any other machine learning systems. Your data remains private and is used solely for providing the educational 
              feedback service.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              We may store your prompts and evaluations in our database to provide you with history and iteration tracking, 
              but this data is not shared with third parties or used for model training purposes.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">4. Prohibited Content</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted leading-relaxed">
              <strong className="text-ink">Do Not Submit Personal or Confidential Information:</strong> You must NOT submit any 
              personal, confidential, sensitive, or proprietary information when using AskRight. This includes, but is not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted ml-4">
              <li>Personal identification information (social security numbers, passport numbers, etc.)</li>
              <li>Financial information (credit card numbers, bank account details, etc.)</li>
              <li>Health information or medical records</li>
              <li>Confidential business information or trade secrets</li>
              <li>Private communications or correspondence</li>
              <li>Any information that could identify you or others</li>
            </ul>
            <p className="text-sm text-muted leading-relaxed">
              By using AskRight, you acknowledge that you understand the risks of submitting information to AI services and agree 
              that AskRight is not responsible for any consequences resulting from the submission of personal or confidential information.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">5. Educational Purpose</h2>
          <p className="text-sm text-muted leading-relaxed">
            AskRight is designed for educational purposes to help users learn prompt engineering. The feedback and evaluations 
            provided are educational in nature and should not be considered as professional advice or guarantees of prompt effectiveness 
            in production environments.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">6. Account Responsibility</h2>
          <p className="text-sm text-muted leading-relaxed">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur 
            under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">7. Service Availability</h2>
          <p className="text-sm text-muted leading-relaxed">
            We strive to provide reliable service but do not guarantee uninterrupted or error-free operation. We reserve the right 
            to modify, suspend, or discontinue the service at any time without prior notice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">8. Limitation of Liability</h2>
          <p className="text-sm text-muted leading-relaxed">
            AskRight is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, 
            special, consequential, or punitive damages resulting from your use of the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">9. Changes to Terms</h2>
          <p className="text-sm text-muted leading-relaxed">
            We reserve the right to modify these Terms at any time. Continued use of the service after changes constitutes 
            acceptance of the modified Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-ink">10. Contact</h2>
          <p className="text-sm text-muted leading-relaxed">
            If you have any questions about these Terms, please contact us through the appropriate channels.
          </p>
        </section>
      </div>
    </div>
  );
}
