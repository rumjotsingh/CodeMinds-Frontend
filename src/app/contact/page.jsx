"use client"
export default function Contact() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-3 text-[#eff1f6]">Contact Us</h1>
          <p className="text-[#eff1f6bf] mb-8">
            Questions? Feedback? Reach out to us below.
          </p>

          <form className="space-y-5 p-6 bg-[#282828] rounded-xl border border-[#303030]" onSubmit={e => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#eff1f6]">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-lg border border-[#303030] px-4 py-3 text-sm bg-[#1a1a1a] text-[#eff1f6] placeholder:text-[#eff1f6bf] focus:outline-none focus:ring-2 focus:ring-[#00b8a3] focus:border-[#00b8a3]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#eff1f6]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-[#303030] px-4 py-3 text-sm bg-[#1a1a1a] text-[#eff1f6] placeholder:text-[#eff1f6bf] focus:outline-none focus:ring-2 focus:ring-[#00b8a3] focus:border-[#00b8a3]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-[#eff1f6]">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                className="w-full rounded-lg border border-[#303030] px-4 py-3 text-sm bg-[#1a1a1a] text-[#eff1f6] placeholder:text-[#eff1f6bf] focus:outline-none focus:ring-2 focus:ring-[#00b8a3] focus:border-[#00b8a3] resize-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-[#00b8a3] text-white font-medium py-3 px-6 rounded-lg text-sm hover:bg-[#00a392] transition"
            >
              Send Message
            </button>
          </form>
        </article>
      </div>
    </div>
  );
}
