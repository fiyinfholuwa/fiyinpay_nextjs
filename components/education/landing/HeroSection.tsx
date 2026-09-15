import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-24">
      <div className="absolute -left-40 top-0 -z-0 size-96 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="relative z-10">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
          <span className="size-1.5 rounded-full bg-blue-600" />
          Learning made personal
        </p>
        <h1 className="max-w-2xl text-5xl font-bold leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
          The right support can change the way you{" "}
          <span className="text-blue-600">learn.</span>
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-slate-500">
          DaraLearn connects students with trusted tutors for focused, flexible
          lessons that fit real life.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/register/student"
            className="rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Find your tutor <span className="ml-2">→</span>
          </Link>
          <Link
            href="/register/tutor"
            className="rounded-xl border border-slate-300 px-5 py-3.5 font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            Become a tutor
          </Link>
        </div>
        <p className="mt-10 text-xs text-slate-500">
          <strong className="text-slate-800">1,200+ learners</strong> are
          building better habits with DaraLearn.
        </p>
      </div>
      <div className="relative z-10 rounded-[2rem] bg-slate-950 p-4 shadow-2xl shadow-blue-200 sm:p-7">
        <div className="relative overflow-hidden rounded-[1.25rem] bg-slate-900 p-5 text-white sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">
                Your learning space
              </p>
              <h2 className="mt-1 text-xl font-bold">
                Good morning, Fiyinfoluwa
              </h2>
            </div>
            <span className="grid size-10 place-items-center rounded-full bg-blue-600 text-sm font-bold">
              F
            </span>
          </div>
          <div className="mt-7 rounded-2xl bg-white p-5 text-slate-900 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Next lesson
                </p>
                <h3 className="mt-2 font-bold">Mathematics with Ada</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Tomorrow · 10:00 AM
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                Confirmed
              </span>
            </div>
            <div className="mt-5 h-2 rounded-full bg-slate-100">
              <div className="h-full w-[72%] rounded-full bg-blue-600" />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              72% of your weekly goal
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/10 p-4">
              <span className="text-xs text-slate-400">Lessons completed</span>
              <strong className="mt-2 block text-2xl">18</strong>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <span className="text-xs text-slate-400">Current streak</span>
              <strong className="mt-2 block text-2xl">7 days</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
