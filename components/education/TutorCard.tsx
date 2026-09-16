"use client";

import Link from "next/link";

type Tutor = {
  name: string;
  subject: string;
  bio: string;
  rating: number | string;
  rate: number | string;
  initials: string;
  color: string;
};

export default function TutorCard({
  tutor,
  onBook,
  profileHref,
}: {
  tutor: Tutor;
  onBook: () => void;
  profileHref?: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div
          className={`grid size-12 shrink-0 place-items-center rounded-full text-sm font-bold text-white ${tutor.color}`}
        >
          {tutor.initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900">{tutor.name}</h3>
          <p className="text-sm font-medium text-blue-600">{tutor.subject}</p>
        </div>
        <span className="ml-auto text-xs font-bold text-amber-600">
          ★ {Number(tutor.rating).toFixed(1)}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">{tutor.bio}</p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-sm font-bold text-slate-800">
          ${tutor.rate}
          <span className="font-normal text-slate-400"> / month</span>
        </span>
        <div className="flex items-center gap-2">
          {profileHref && <Link href={profileHref} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">View profile</Link>}
          <button
            onClick={onBook}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
          >
            Book lesson
          </button>
        </div>
      </div>
    </article>
  );
}
