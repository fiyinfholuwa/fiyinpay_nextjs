"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EmailVerificationGate from "@/components/education/EmailVerificationGate";
import TutorRequests from "@/components/education/TutorRequests";
import { authorizedApi } from "@/lib/api";

type User = { firstName: string; email: string; emailVerified: boolean };
type Booking = { id: string; startsAt: string; status: string; student: { firstName: string; lastName: string }; subject: { name: string } };
type Schedule = { id: string; startsAt: string; endsAt: string; meetingLink: string; subject: { name: string } };
type Earnings = { balance: number | string; currency: string };

export default function TutorDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [earnings, setEarnings] = useState<Earnings | null>(null);

  useEffect(() => {
    authorizedApi<User>("/auth/me").then(setUser).catch(() => undefined);
    authorizedApi<Booking[]>("/tutors/me/bookings").then(setBookings).catch(() => setBookings([]));
    authorizedApi<Schedule[]>("/tutors/me/schedules").then(setSchedules).catch(() => setSchedules([]));
    authorizedApi<Earnings>("/tutors/me/earnings").then(setEarnings).catch(() => undefined);
  }, []);

  const now = new Date();
  const upcoming = bookings.filter((booking) => booking.status === "CONFIRMED" && new Date(booking.startsAt) >= now);
  const today = now;
  const todaySchedule = schedules
    .filter((schedule) => {
      const startsAt = new Date(schedule.startsAt);
      return startsAt.getFullYear() === today.getFullYear()
        && startsAt.getMonth() === today.getMonth()
        && startsAt.getDate() === today.getDate();
    })
    .slice(0, 5);
  const students = new Set(bookings.map((booking) => `${booking.student.firstName} ${booking.student.lastName}`)).size;

  return (
    <main className="w-full space-y-8 px-5 py-10 sm:px-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Tutor dashboard</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Welcome back, {user?.firstName ?? "tutor"}</h1>
        <p className="mt-2 text-slate-500">Manage your students and upcoming lessons.</p>
      </div>
      {user && !user.emailVerified && <EmailVerificationGate email={user.email} onVerified={() => setUser({ ...user, emailVerified: true })} />}
      <div className="grid gap-5 sm:grid-cols-3"><div className="rounded-2xl bg-blue-600 p-5 text-white"><span className="text-sm text-blue-100">Upcoming lessons</span><strong className="mt-3 block text-3xl">{upcoming.length}</strong></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><span className="text-sm text-slate-500">Active students</span><strong className="mt-3 block text-3xl">{students}</strong></div><Link href="/tutor/earnings" className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"><span className="text-sm text-slate-500">Available earnings</span><strong className="mt-3 block text-3xl">{earnings?.currency ?? "NGN"} {Number(earnings?.balance ?? 0).toLocaleString()}</strong><span className="mt-2 block text-xs font-bold text-blue-600">View earnings</span></Link></div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><TutorRequests /><div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold">Today&apos;s schedule</h2><Link href="/tutor/schedule" className="text-xs font-bold text-blue-600 hover:text-blue-800">View all schedules</Link></div><div className="mt-5 space-y-3">{todaySchedule.map((schedule) => <div className="rounded-xl bg-blue-50 p-4" key={schedule.id}><strong className="block text-sm">{new Date(schedule.startsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {schedule.subject.name}</strong><span className="block text-xs text-slate-500">Ends {new Date(schedule.endsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span><a href={schedule.meetingLink} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold text-blue-700 hover:text-blue-900">Open class link</a></div>)}{!todaySchedule.length && <p className="text-sm text-slate-500">No classes scheduled for today.</p>}</div></div></div>
    </main>
  );
}
