export default function About() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-8 text-[#eff1f6]">About Us</h1>
          
          <div className="space-y-8 text-[#eff1f6bf]">
            <p className="leading-relaxed text-lg">
              Our mission is to empower developers worldwide through challenging problems, insightful learning tools,
              and an engaging community.
            </p>

            <section className="p-6 bg-[#282828] rounded-xl border border-[#303030]">
              <h2 className="text-xl font-semibold text-[#eff1f6] mb-3">Our Mission</h2>
              <p className="leading-relaxed">
                To provide the best platform for interview preparation and skill development with quality content and unmatched analytics.
              </p>
            </section>

            <section className="p-6 bg-[#282828] rounded-xl border border-[#303030]">
              <h2 className="text-xl font-semibold text-[#eff1f6] mb-3">Our Team</h2>
              <p className="leading-relaxed">
                A diverse group of passionate engineers, educators, and designers working together to make technical careers
                accessible to everyone.
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
