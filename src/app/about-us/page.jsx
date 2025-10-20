export default function About() {
  return (
    <div className="min-h-[80vh] flex justify-center px-5 py-10 bg-background text-foreground">
      <article className="rounded-2xl border border-border bg-card p-12 max-w-3xl w-full shadow-sm">
        <h1 className="text-4xl font-extrabold mb-5 text-primary">About Us</h1>
        <p className="text-lg leading-relaxed text-muted-foreground mb-6">
          Our mission is to empower developers worldwide through challenging problems, insightful learning tools,
          and an engaging community.
        </p>

        <section>
          <h2 className="text-2xl font-bold mt-10 mb-3 text-primary">Our Mission</h2>
          <p className="text-lg leading-relaxed text-muted-foreground mb-6">
            To provide the best platform for interview preparation and skill development with quality content and unmatched analytics.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-10 mb-3 text-primary">Our Team</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            A diverse group of passionate engineers, educators, and designers working together to make technical careers
            accessible to everyone.
          </p>
        </section>
      </article>
    </div>
  );
}
