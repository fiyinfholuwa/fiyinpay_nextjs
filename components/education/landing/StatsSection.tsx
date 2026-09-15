export default function StatsSection() {
  return (
    <section className="border-y border-slate-100 bg-slate-50/70 px-5 py-8 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 text-center sm:grid-cols-3 sm:text-left">
        <div>
          <strong className="text-2xl text-slate-950">1,200+</strong>
          <p className="mt-1 text-sm text-slate-500">students learning</p>
        </div>
        <div>
          <strong className="text-2xl text-slate-950">250+</strong>
          <p className="mt-1 text-sm text-slate-500">trusted tutors</p>
        </div>
        <div>
          <strong className="text-2xl text-slate-950">4.9/5</strong>
          <p className="mt-1 text-sm text-slate-500">average tutor rating</p>
        </div>
      </div>
    </section>
  );
}
