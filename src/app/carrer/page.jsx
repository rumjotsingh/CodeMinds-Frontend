'use client'
export default function Careers() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-8 text-[#eff1f6]">Careers</h1>

          <div className="space-y-8 text-[#eff1f6bf]">
            <p className="leading-relaxed text-lg">
              Join us to build the future of coding education!
            </p>

            <section className="p-6 bg-[#282828] rounded-xl border border-[#303030]">
              <h2 className="text-xl font-semibold text-[#eff1f6] mb-4">Open Positions</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg border border-[#303030]">
                  <span className="w-2 h-2 bg-[#00b8a3] rounded-full"></span>
                  <div>
                    <strong className="font-medium text-[#eff1f6]">Frontend Engineer</strong>
                    <span className="text-sm ml-2">— Remote, Full-time</span>
                  </div>
                </li>
                <li className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg border border-[#303030]">
                  <span className="w-2 h-2 bg-[#00b8a3] rounded-full"></span>
                  <div>
                    <strong className="font-medium text-[#eff1f6]">Content Creator</strong>
                    <span className="text-sm ml-2">— Contract / Flexible</span>
                  </div>
                </li>
              </ul>
            </section>

            <section className="p-6 bg-[#282828] rounded-xl border border-[#303030]">
              <p>
                If interested, please send your resume and portfolio to{' '}
                <a href="mailto:careers@example.com" className="text-[#00b8a3] hover:underline">
                  careers@example.com
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
