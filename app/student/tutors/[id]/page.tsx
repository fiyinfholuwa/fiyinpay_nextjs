"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Section from "@/components/education/Section";
import Toast, { ToastData } from "@/components/ui/Toast";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Tutor = {
  id: string;
  bio?: string | null;
  monthlyRate: number | string;
  currency: string;
  kycStatus: string;
  user: { id: string; firstName: string; lastName: string; email: string };
  skills: { subjectId: string; subject: { name: string; description?: string | null } }[];
};

export default function TutorProfilePage() {
  const params = useParams<{ id: string }>();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    authorizedApi<Tutor>(`/tutors/${params.id}`)
      .then(setTutor)
      .catch((error) => setToast({ type: "error", title: "Unable to load tutor", message: error instanceof Error ? error.message : "Please try again." }))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function bookLesson() {
    if (!tutor || !tutor.skills[0]) return;
    const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);
    setBooking(true);
    try {
      await authorizedApi("/bookings", {
        method: "POST",
        body: JSON.stringify({
          tutorId: tutor.user.id,
          subjectId: tutor.skills[0].subjectId,
          startsAt: startsAt.toISOString(),
          endsAt: endsAt.toISOString(),
        }),
      });
      setToast({ type: "success", title: "Booking created", message: "Fund your wallet, then confirm the lesson from My subscriptions." });
    } catch (error) {
      setToast({ type: "error", title: "Unable to create booking", message: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setBooking(false);
    }
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <WorkspacePage eyebrow="Student workspace" title="Tutor profile" description="Review the tutor details before booking a lesson.">
        <Link href="/student/tutors" className="text-sm font-bold text-blue-600 hover:text-blue-700">← Back to tutors</Link>
        {loading && <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading tutor profile...</div>}
        {!loading && tutor && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
            <Section title={`${tutor.user.firstName} ${tutor.user.lastName}`} description={tutor.bio ?? "A verified tutor ready to help you make progress."}>
              <div className="flex flex-wrap gap-2">
                {tutor.skills.map((skill) => <span key={skill.subjectId} className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">{skill.subject.name}</span>)}
              </div>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">About this tutor</h2>
                <p className="mt-3 leading-7 text-slate-600">{tutor.bio ?? "This tutor is ready to support your learning goals with focused, practical lessons."}</p>
              </div>
            </Section>
            <Section title="Lesson details" description="Start with a one-hour lesson tomorrow. You can confirm it from subscriptions after funding your wallet.">
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4"><span className="text-slate-500">Subscription</span><strong className="text-slate-900">{tutor.currency} {Number(tutor.monthlyRate).toLocaleString()} / month</strong></div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4"><span className="text-slate-500">Verification</span><strong className="text-emerald-700">{tutor.kycStatus}</strong></div>
                <div className="flex items-center justify-between"><span className="text-slate-500">Subjects</span><strong className="text-slate-900">{tutor.skills.length}</strong></div>
              </div>
              <button type="button" disabled={booking} onClick={bookLesson} className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{booking ? "Creating booking..." : "Book a lesson"}</button>
            </Section>
          </div>
        )}
      </WorkspacePage>
    </>
  );
}
