import Link from "next/link";
const tutors = [
  {
    initials: "AJ",
    name: "Ada Johnson",
    subject: "Mathematics",
    rating: "4.9",
    color: "bg-violet-500",
  },
  {
    initials: "SO",
    name: "Samuel Okafor",
    subject: "Physics",
    rating: "4.8",
    color: "bg-emerald-500",
  },
  {
    initials: "MW",
    name: "Maya Williams",
    subject: "English",
    rating: "5.0",
    color: "bg-orange-500",
  },
];
export default function TutorShowcase() {
  return (
    <section
      id="tutors"
      className="bg-slate-950 px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Meet your match
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Learn from people who care.
            </h2>
          </div>
          <Link
            href="/register/student"
            className="text-sm font-semibold text-blue-300 hover:text-white"
          >
            Explore all tutors →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {tutors.map((tutor) => (
            <article
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              key={tutor.name}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`grid size-12 place-items-center rounded-full text-sm font-bold text-white ${tutor.color}`}
                >
                  {tutor.initials}
                </div>
                <div>
                  <h3 className="font-bold">{tutor.name}</h3>
                  <p className="text-sm text-slate-400">{tutor.subject}</p>
                </div>
                <span className="ml-auto text-xs font-bold text-amber-300">
                  ★ {tutor.rating}
                </span>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                <span>Available this week</span>
                <span className="font-semibold text-blue-300">
                  View profile →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
