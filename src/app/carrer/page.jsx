'use client'
export default function Careers() {
  return (
    <div className="min-h-[80vh] flex justify-center px-5 py-10 bg-background text-foreground">
      <article className="bg-card rounded-2xl shadow-lg p-12 max-w-3xl w-full border border-border transition-shadow duration-200 hover:shadow-xl">
        <h1 className="text-4xl font-extrabold mb-5 text-primary">Careers</h1>

        <p className="text-lg leading-relaxed text-muted-foreground mb-8">
          Join us to build the future of coding education!
        </p>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-primary">Open Positions</h2>
          <ul className="list-disc list-inside space-y-3 text-muted-foreground mb-8">
            <li>
              <strong>Frontend Engineer</strong> — Remote, Full-time
            </li>
            <li>
              <strong>Content Creator</strong> — Contract / Flexible
            </li>
            {/* Add more roles here */}
          </ul>
        </section>

        <section className="text-muted-foreground">
          <p>
            If interested, please send your resume and portfolio to{' '}
            <a href="mailto:careers@example.com" className="text-primary underline hover:text-primary/80">
              careers@example.com
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
