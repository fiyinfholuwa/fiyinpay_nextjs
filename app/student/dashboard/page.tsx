"use client";

import { useEffect, useState } from "react";
import BookingSummary from "@/components/education/BookingSummary";
import EmailVerificationGate from "@/components/education/EmailVerificationGate";
import EmptyState from "@/components/education/EmptyState";
import FundWalletModal from "@/components/education/FundWalletModal";
import TutorCard from "@/components/education/TutorCard";
import Toast, { ToastData } from "@/components/ui/Toast";
import { authorizedApi } from "@/lib/api";

type User = { firstName: string; lastName: string; email: string; emailVerified: boolean };
type Tutor = { id: string; bio?: string | null; monthlyRate: number | string; user: { id: string; firstName: string; lastName: string }; skills: { subjectId: string; subject: { name: string } }[] };
type Booking = { id: string; status: string; subscription?: { status: string } | null };
type Assignment = { id: string; dueAt?: string | null; submission?: { score?: number | null } | null };

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    authorizedApi<User>("/auth/me").then(setUser).catch(() => undefined);
    authorizedApi<Tutor[]>("/students/me/recommendations").then(setTutors).catch(() => setTutors([]));
    authorizedApi<Booking[]>("/students/me/bookings").then(setBookings).catch(() => setBookings([]));
    authorizedApi<Assignment[]>("/students/me/assignments").then(setAssignments).catch(() => setAssignments([]));
  }, []);

  const activeSubscriptions = bookings.filter((booking) => booking.subscription?.status === "ACTIVE").length;
  const completedClasses = bookings.filter((booking) => booking.status === "COMPLETED").length;
  const pendingAssignments = assignments.filter((assignment) => !assignment.submission && (!assignment.dueAt || new Date(assignment.dueAt) > new Date())).length;

  async function bookTutor(tutor: Tutor) {
    const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);
    try {
      await authorizedApi("/bookings", {
        method: "POST",
        body: JSON.stringify({
          tutorId: tutor.user.id,
          subjectId: tutor.skills[0]?.subjectId,
          startsAt: startsAt.toISOString(),
          endsAt: endsAt.toISOString(),
        }),
      });
      setToast({ type: "success", title: "Booking created", message: "Fund your wallet, then confirm the lesson from My subscriptions." });
    } catch (error) {
      setToast({ type: "error", title: "Unable to create booking", message: error instanceof Error ? error.message : "Please try again." });
    }
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <main className="w-full space-y-8 px-5 py-10 sm:px-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Student dashboard</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Good morning, {user?.firstName ?? "learner"}</h1>
        <p className="mt-2 text-slate-500">Find a tutor and keep your learning moving forward.</p>
      </div>
      {user && !user.emailVerified && <EmailVerificationGate email={user.email} onVerified={() => setUser({ ...user, emailVerified: true })} />}
      <div className="grid items-start gap-6 xl:grid-cols-[1.35fr_.8fr_.8fr]">
        <BookingSummary />
        <FundWalletModal emailVerified={user?.emailVerified ?? true} />
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Learning stats</p><div className="mt-4 space-y-3"><div className="flex items-center justify-between text-sm"><span className="text-slate-500">Active subscriptions</span><strong className="text-slate-900">{activeSubscriptions}</strong></div><div className="flex items-center justify-between text-sm"><span className="text-slate-500">Completed classes</span><strong className="text-slate-900">{completedClasses}</strong></div><div className="flex items-center justify-between text-sm"><span className="text-slate-500">Assignments due</span><strong className="text-slate-900">{pendingAssignments}</strong></div></div></div>
      </div>
      <section><h2 className="text-2xl font-bold">Recommended tutors</h2><p className="mt-1 text-sm text-slate-500">Based on your interests and tutor verification</p><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{tutors.map((tutor) => <TutorCard key={tutor.id} tutor={{ name: `${tutor.user.firstName} ${tutor.user.lastName}`, subject: tutor.skills[0]?.subject.name ?? "Tutor", bio: tutor.bio ?? "A verified tutor ready to help you make progress.", rating: 5, rate: tutor.monthlyRate, initials: `${tutor.user.firstName[0]}${tutor.user.lastName[0]}`, color: "bg-blue-600" }} profileHref={`/student/tutors/${tutor.id}`} onBook={() => bookTutor(tutor)} />)}{!tutors.length && <div className="md:col-span-2 xl:col-span-3"><EmptyState title="Build your learning plan" description="Choose your interests to get tutor recommendations made for your goals." action={{ label: "Choose interests", onClick: () => window.location.assign("/student/onboarding") }} /></div>}</div></section>
      </main>
    </>
  );
}
