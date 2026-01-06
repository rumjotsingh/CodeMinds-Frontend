'use client'
export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-8 text-[#eff1f6]">Privacy Policy</h1>

          <div className="space-y-8 text-[#eff1f6bf]">
            <p className="leading-relaxed text-lg">
              We value and respect your privacy. This policy explains what information we collect and how it&apos;s used.
            </p>

            <section className="p-6 bg-[#282828] rounded-xl border border-[#303030]">
              <h2 className="text-xl font-semibold text-[#eff1f6] mb-3">Information We Collect</h2>
              <p className="leading-relaxed">
                We collect information provided during account creation and usage of our services to improve your experience.
              </p>
            </section>

            <section className="p-6 bg-[#282828] rounded-xl border border-[#303030]">
              <h2 className="text-xl font-semibold text-[#eff1f6] mb-3">How We Use Your Information</h2>
              <p className="leading-relaxed">
                Usage data is used to tailor recommendations, improve platform functionality, and communicate important updates.
              </p>
            </section>

            <section className="p-6 bg-[#282828] rounded-xl border border-[#303030]">
              <h2 className="text-xl font-semibold text-[#eff1f6] mb-3">Data Security</h2>
              <p className="leading-relaxed">
                We apply industry-standard security measures to protect your data from unauthorized access.
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
