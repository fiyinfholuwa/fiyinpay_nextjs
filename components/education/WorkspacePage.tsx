import Section from "./Section";

export default function WorkspacePage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="w-full px-5 py-10 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
        {title}
      </h1>
      <p className="mt-2 text-slate-500">{description}</p>
      <div className="mt-8">{children}</div>
    </main>
  );
}
