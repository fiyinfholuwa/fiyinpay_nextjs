import Brand from "../Brand";

export default function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-blue-900/70 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-5 pt-14 text-slate-300 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute -right-24 top-10 size-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 size-80 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 pb-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <Brand className="text-white" />
          <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
            A more personal way to learn, teach, and make steady progress with
            the right support.
          </p>
          <a
            href="mailto:hello@daralearn.com"
            className="mt-5 inline-block text-sm font-semibold text-blue-300 hover:text-blue-200"
          >
            hello@daralearn.com
          </a>
        </div>
        <FooterColumn
          title="Explore"
          links={[
            ["How it works", "#how-it-works"],
            ["Find a tutor", "#tutors"],
            ["Why DaraLearn", "#why-daralearn"],
          ]}
        />
        <FooterColumn
          title="Get started"
          links={[
            ["Create an account", "/register/student"],
            ["Become a tutor", "/register/tutor"],
            ["Log in", "/login"],
          ]}
        />
        <FooterColumn
          title="Support"
          links={[
            ["Help center", "mailto:hello@daralearn.com"],
            ["Contact us", "mailto:hello@daralearn.com"],
            ["Privacy policy", "#"],
          ]}
        />
      </div>
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-between gap-3 border-t border-white/10 py-6 text-xs text-slate-400 sm:flex-row sm:items-center">
        <span>© 2026 DaraLearn. Learn with confidence.</span>
        <span>Made for curious minds everywhere.</span>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h2 className="text-sm font-bold text-white">{title}</h2>
      <nav className="mt-4 flex flex-col items-start gap-3 text-sm text-slate-400">
        {links.map(([label, href]) => (
          <a className="transition hover:text-blue-300" href={href} key={label}>
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
