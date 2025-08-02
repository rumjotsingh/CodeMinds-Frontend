'use client'
export default function Careers() {
  return (
    <div className="min-h-[80vh] bg-gray-50 flex justify-center px-5 py-10">
      <article className="bg-white rounded-2xl shadow-lg p-12 max-w-3xl w-full transition-shadow duration-200 hover:shadow-xl">
        <h1 className="text-4xl font-extrabold mb-5 text-gray-900">Careers</h1>

        <p className="text-lg leading-relaxed text-gray-700 mb-8">
          Join us to build the future of coding education!
        </p>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Open Positions</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 mb-8">
            <li>
              <strong>Frontend Engineer</strong> — Remote, Full-time
            </li>
            <li>
              <strong>Content Creator</strong> — Contract / Flexible
            </li>
            {/* Add more roles here */}
          </ul>
        </section>

        <section className="text-gray-700">
          <p>
            If interested, please send your resume and portfolio to{" "}
            <a href="mailto:careers@example.com" className="text-teal-600 underline hover:text-teal-800">
              careers@example.com
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
