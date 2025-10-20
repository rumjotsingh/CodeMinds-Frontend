"use client"
export default function Contact() {
  return (
    <div className="min-h-[80vh] flex justify-center px-5 py-10 bg-background text-foreground">
      <article className="rounded-2xl border border-border bg-card p-12 max-w-3xl w-full shadow-sm">
        <h1 className="text-4xl font-extrabold mb-5 text-primary">Contact Us</h1>
        <p className="text-lg leading-relaxed text-muted-foreground mb-6">
          Questions? Feedback? Reach out to us below.
        </p>

        <form className="space-y-6" onSubmit={e => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block text-muted-foreground font-semibold mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-border px-4 py-3 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-muted-foreground font-semibold mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-border px-4 py-3 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-muted-foreground font-semibold mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              className="w-full rounded-lg border border-border px-4 py-3 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:bg-primary/90 transition"
          >
            Send Message
          </button>
        </form>
      </article>
    </div>
  );
}
