export default function BenefitsSection() {
  return (
    <section
      id="why-daralearn"
      className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-28"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Built for progress
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          A better rhythm for every learner.
        </h2>
        <p className="mt-5 max-w-lg leading-7 text-slate-500">
          Whether you need help with one difficult topic or want a long-term
          learning partner, DaraLearn keeps the experience clear and human.
        </p>
        <div className="mt-8 space-y-5">
          {[
            "Trusted connections|Find tutors with transparent profiles and real feedback.",
            "Flexible learning|Book lessons around your schedule and your goals.",
          ].map((benefit) => {
            const [title, text] = benefit.split("|");
            return (
              <div className="flex gap-4" key={title}>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  ✓
                </span>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-3xl bg-blue-50 p-6 sm:p-10">
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Your progress
          </p>
          <div className="mt-6 flex items-end justify-between">
            <strong className="text-4xl text-slate-950">7 days</strong>
            <span className="text-sm font-bold text-emerald-600">+24%</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">Current learning streak</p>
          <div className="mt-7 flex items-end gap-2">
            {[35, 50, 42, 70, 58, 82, 94].map((height, index) => (
              <div
                className={`flex-1 rounded-t-md ${index === 6 ? "bg-blue-600" : "bg-blue-200"}`}
                style={{ height: `${height}px` }}
                key={height}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-slate-400">
            <span>Mon</span>
            <span>Sun</span>
          </div>
        </div>
      </div>
    </section>
  );
}
