const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    text: "Choose a subject, your goals, and a schedule that works for you.",
  },
  {
    number: "02",
    title: "Meet your match",
    text: "Browse trusted tutors with real profiles, ratings, and clear pricing.",
  },
  {
    number: "03",
    title: "Start making progress",
    text: "Book a lesson, build a routine, and learn at your own pace.",
  },
];
export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="max-w-xl">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Simple by design
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Learning support, without the friction.
        </h2>
        <p className="mt-4 leading-7 text-slate-500">
          Everything you need to find the right person, make a plan, and keep
          moving.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <article
            className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            key={step.number}
          >
            <span className="text-sm font-bold text-blue-600">
              {step.number}
            </span>
            <h3 className="mt-12 text-lg font-bold text-slate-950">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-500">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
