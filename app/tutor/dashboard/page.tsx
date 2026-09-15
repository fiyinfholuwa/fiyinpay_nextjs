"use client";

import { useEffect, useState } from "react";
import TutorRequests from "@/components/education/TutorRequests";
import { authorizedApi } from "@/lib/api";

type User = { firstName: string };
type Booking = { id: string; startsAt: string; status: string; student: { firstName: string; lastName: string }; subject: { name: string } };
type Earnings = { balance: number | string };

export default function TutorDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  useEffect(() => { authorizedApi<User>("/auth/me").then(setUser).catch(() => undefined); authorizedApi<Booking[]>("/tutors/me/bookings").then(setBookings).catch(() => setBookings([])); authorizedApi<Earnings>("/tutors/me/earnings").then(setEarnings).catch(() => undefined); }, []);
  const upcoming = bookings.filter((booking) => booking.status === "CONFIRMED");
  const students = new Set(bookings.map((booking) => `${booking.student.firstName} ${booking.student.lastName}`)).size;
  return <main className="w-full px-5 py-10 sm:px-8"><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Tutor dashboard</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Welcome back, {user?.firstName ?? "tutor"}</h1><p className="mt-2 text-slate-500">Manage your students and upcoming lessons.</p><div className="mt-8 grid gap-5 sm:grid-cols-3"><div className="rounded-2xl bg-blue-600 p-5 text-white"><span className="text-sm text-blue-100">Upcoming lessons</span><strong className="mt-3 block text-3xl">{upcoming.length}</strong></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><span className="text-sm text-slate-500">Active students</span><strong className="mt-3 block text-3xl">{students}</strong></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><span className="text-sm text-slate-500">Available earnings</span><strong className="mt-3 block text-3xl">NGN {Number(earnings?.balance ?? 0).toLocaleString()}</strong></div></div><div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><TutorRequests /><div className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-bold">Today&apos;s schedule</h2><div className="mt-5 space-y-3">{upcoming.slice(0, 5).map((booking) => <div className="rounded-xl bg-blue-50 p-4" key={booking.id}><strong className="block text-sm">{new Date(booking.startsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {booking.subject.name}</strong><span className="text-xs text-slate-500">with {booking.student.firstName} {booking.student.lastName}</span></div>)}{!upcoming.length && <p className="text-sm text-slate-500">No confirmed lessons yet.</p>}</div></div></div></main>;
}
