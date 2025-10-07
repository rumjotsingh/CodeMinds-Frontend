"use client"
export default function Contact() {
  return (
    <div className="min-h-[80vh]  flex justify-center px-5 py-10">
      <article className=" rounded-2xl border border-[#e3e3e3] p-12 max-w-3xl w-full">
        <h1 className="text-4xl font-extrabold mb-5 text-gray-900">Contact Us</h1>
        <p className="text-lg leading-relaxed text-gray-700 mb-6">
          Questions? Feedback? Reach out to us below.
        </p>

        <form className="space-y-6" onSubmit={e => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-black text-white font-semibold py-3 px-6 rounded-xl"
          >
            Send Message
          </button>
        </form>
      </article>
    </div>
  );
}
