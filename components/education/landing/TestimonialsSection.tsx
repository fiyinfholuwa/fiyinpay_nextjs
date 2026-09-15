const testimonials = [
  {
    quote:
      "I stopped feeling stuck because every lesson has a clear goal. My tutor meets me exactly where I am.",
    name: "Fiyinfoluwa A.",
    detail: "Student · Mathematics",
    initials: "FA",
  },
  {
    quote:
      "DaraLearn makes it easy to build a routine. I can see my progress and know what to focus on next.",
    name: "Chiamaka N.",
    detail: "Student · Physics",
    initials: "CN",
  },
  {
    quote:
      "The platform lets me spend less time coordinating and more time helping learners make real progress.",
    name: "David O.",
    detail: "Tutor · English",
    initials: "DO",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Real progress, real people
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          A learning experience people come back to.
        </h2>
        <p className="mt-4 leading-7 text-slate-500">
          From a first breakthrough to a lasting study habit, DaraLearn helps
          learners keep moving forward.
        </p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            key={testimonial.name}
          >
            <div className="text-lg tracking-widest text-amber-400">★★★★★</div>
            <blockquote className="mt-5 flex-1 text-sm leading-7 text-slate-600">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
              <span className="grid size-10 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                {testimonial.initials}
              </span>
              <span>
                <strong className="block text-sm text-slate-950">
                  {testimonial.name}
                </strong>
                <span className="text-xs text-slate-500">{testimonial.detail}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
