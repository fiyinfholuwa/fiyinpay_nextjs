"use client";

import { useEffect, useState } from "react";
import BookingSummary from "@/components/education/BookingSummary";
import FundWalletModal from "@/components/education/FundWalletModal";
import TutorCard from "@/components/education/TutorCard";
import { authorizedApi } from "@/lib/api";

type User = { firstName: string; lastName: string };
type Tutor = { id: string; bio?: string | null; monthlyRate: number | string; user: { id: string; firstName: string; lastName: string }; skills: { subjectId: string; subject: { name: string } }[] };

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  useEffect(() => {
    authorizedApi<User>("/auth/me").then(setUser).catch(() => undefined);
    authorizedApi<Tutor[]>("/students/me/recommendations").then(setTutors).catch(() => setTutors([]));
  }, []);
  return <main className="w-full px-5 py-10 sm:px-8"><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Student dashboard</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Good morning, {user?.firstName ?? "learner"}</h1><p className="mt-2 text-slate-500">Find a tutor and keep your learning moving forward.</p><div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_.8fr]"><BookingSummary /><div className="space-y-5"><FundWalletModal /><div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Learning plan</p><strong className="mt-5 block text-3xl">{tutors.length}</strong><p className="mt-3 text-sm text-slate-500">recommended tutors matched to your interests</p></div></div></div><div className="mt-12"><h2 className="text-2xl font-bold">Recommended tutors</h2><p className="mt-1 text-sm text-slate-500">Based on your interests and tutor verification</p><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{tutors.map((tutor) => <TutorCard key={tutor.id} tutor={{ name: `${tutor.user.firstName} ${tutor.user.lastName}`, subject: tutor.skills[0]?.subject.name ?? "Tutor", bio: tutor.bio ?? "A verified tutor ready to help you make progress.", rating: 5, rate: tutor.monthlyRate, initials: `${tutor.user.firstName[0]}${tutor.user.lastName[0]}`, color: "bg-blue-600" }} onBook={() => window.location.assign("/student/tutors")} />)}{!tutors.length && <p className="text-sm text-slate-500">Complete your interests to receive tutor recommendations.</p>}</div></div></main>;
}
