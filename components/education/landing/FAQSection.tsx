const questions = [
  {
    question: "How do I find the right tutor?",
    answer:
      "Tell us your subject, goals, and availability, then browse tutor profiles with their experience, ratings, and teaching focus.",
  },
  {
    question: "Can I choose when lessons happen?",
    answer:
      "Yes. You can find tutors with availability that fits your schedule and book lessons around your week.",
  },
  {
    question: "What happens after I book a lesson?",
    answer:
      "You will see the lesson in your dashboard, with the details you need to prepare and keep your learning plan on track.",
  },
  {
    question: "Can I become a tutor on DaraLearn?",
    answer:
      "Absolutely. Tutors can create a profile, share their expertise, manage requests, and build meaningful learning relationships.",
  },
];

export default function FAQSection() {
  return (
    <section className="bg-slate-50/80 px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Questions, answered
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Everything you need to get started.
          </h2>
          <p className="mt-4 max-w-md leading-7 text-slate-500">
            Still curious? Our team is here to help you choose the next best
            step for your learning journey.
          </p>
          <a
            href="mailto:hello@daralearn.com"
            className="mt-6 inline-flex text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            Talk to our team →
          </a>
        </div>
        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 sm:px-7">
          {questions.map((item) => (
            <details className="group py-5" key={item.question}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-slate-950 [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-50 text-lg font-normal text-blue-600 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl pr-10 text-sm leading-6 text-slate-500">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
