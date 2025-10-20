'use client'
export default function Privacy() {
  return (
    <div className="min-h-[80vh] flex justify-center px-5 py-10 bg-background text-foreground">
      <article className="rounded-2xl border border-border bg-card p-12 max-w-3xl w-full shadow-sm">
        <h1 className="text-4xl font-extrabold mb-5 text-primary">Privacy Policy</h1>

        <p className="text-lg leading-relaxed text-muted-foreground mb-6">
          We value and respect your privacy. This policy explains what information we collect and how it's used.
        </p>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-primary">Information We Collect</h2>
          <p className="text-muted-foreground mb-6">
            We collect information provided during account creation and usage of our services to improve your experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-primary">How We Use Your Information</h2>
          <p className="text-muted-foreground mb-6">
            Usage data is used to tailor recommendations, improve platform functionality, and communicate important updates.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-primary">Data Security</h2>
          <p className="text-muted-foreground">
            We apply industry-standard security measures to protect your data from unauthorized access.
          </p>
        </section>
      </article>
    </div>
  );
}
