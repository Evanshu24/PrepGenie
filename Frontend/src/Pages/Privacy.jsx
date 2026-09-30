import { useNavigate } from "react-router-dom";

export default function Privacy() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition cursor-pointer"
          >
            <span className="text-xl">←</span>
            <span>Back to {token ? "Dashboard" : "Home"}</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: 1 October 2026
        </p>
        <div className="space-y-8 text-gray-700 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you use PrepPilot, we may collect information such as your
              name, email address, account information, resume, interview
              responses, and information you provide while using the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. How We Use Your Information
            </h2>
            <p>
              We use the information we collect to provide and improve
              PrepPilot's features, authenticate users, process resumes, conduct
              mock interviews, generate AI-based feedback, and maintain the
              security of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Resume Information
            </h2>
            <p>
              If you upload a resume, it may be processed to extract relevant
              information such as skills, experience, and other details needed
              to personalize your interview experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Interview Data
            </h2>
            <p>
              Information provided during mock interviews, including responses
              and generated evaluations, may be stored and associated with your
              account so that you can review your interview history and results.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Authentication and Security
            </h2>
            <p>
              PrepPilot may use authentication methods such as email
              verification, password authentication, and third-party
              authentication services. We take reasonable measures to protect
              account information and prevent unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Third-Party Services
            </h2>
            <p>
              PrepPilot may use third-party services for authentication, cloud
              storage, AI processing, communication, and other platform
              functionality. Information may be processed by these services as
              necessary to provide the requested features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Data Retention
            </h2>
            <p>
              We retain information for as long as reasonably necessary to
              provide the platform's services, maintain user accounts, comply
              with applicable obligations, and support legitimate operational
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Your Choices
            </h2>
            <p>
              You may update certain account information through the platform.
              If you have questions regarding your personal information or wish
              to request changes, please contact the PrepPilot team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Children's Privacy
            </h2>
            <p>
              PrepPilot is not intended for children who are not legally
              permitted to use online services in their jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              10. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with a revised effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              11. Contact
            </h2>
            <p>
              If you have questions about our policies, please contact us at{" "}
              <a
                href="mailto:preppilot.support@gmail.com"
                className="text-blue-600 hover:underline"
              >
                preppilot.support@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
