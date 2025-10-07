'use client'
export default function Privacy() {
  return (
    <div className="min-h-[80vh]  flex justify-center px-5 py-10">
      <article className=" rounded-2xl  p-12 max-w-3xl w-full">
        <h1 className="text-4xl font-extrabold mb-5 text-gray-900">Privacy Policy</h1>

        <p className="text-lg leading-relaxed text-gray-700 mb-6">
          We value and respect your privacy. This policy explains what information we collect and how it's used.
        </p>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Information We Collect</h2>
          <p className="text-gray-700 mb-6">
            We collect information provided during account creation and usage of our services to improve your experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">How We Use Your Information</h2>
          <p className="text-gray-700 mb-6">
            Usage data is used to tailor recommendations, improve platform functionality, and communicate important updates.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Data Security</h2>
          <p className="text-gray-700">
            We apply industry-standard security measures to protect your data from unauthorized access.
          </p>
        </section>
      </article>
    </div>
  );
}
