"use client";
import { useEffect, useState } from "react";
import EmptyState from "@/components/education/EmptyState";
import TutorCard from "@/components/education/TutorCard";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Recommendation = {
  id: string;
  bio?: string | null;
  monthlyRate: number | string;
  user: { id: string; firstName: string; lastName: string };
  skills: { subjectId: string; subject: { name: string } }[];
};

export default function TutorsPage() {
  const [search, setSearch] = useState("");
  const [tutors, setTutors] = useState<Recommendation[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    authorizedApi<Recommendation[]>("/students/me/recommendations")
      .then(setTutors)
      .catch((error) => setMessage(error.message));
  }, []);
  const filteredTutors = tutors.filter((tutor) =>
    `${tutor.user.firstName} ${tutor.user.lastName} ${tutor.skills[0]?.subject.name ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <WorkspacePage
      eyebrow="Student workspace"
      title="Find a tutor"
      description="Search trusted tutors by name or subject."
    >
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="mb-6 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        placeholder="Search Mathematics, English..."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredTutors.map((tutor) => (
          <TutorCard
            key={tutor.id}
            tutor={{ name: `${tutor.user.firstName} ${tutor.user.lastName}`, subject: tutor.skills[0]?.subject.name ?? "Tutor", bio: tutor.bio ?? "A verified tutor ready to help you make progress.", rating: 5, rate: tutor.monthlyRate, initials: `${tutor.user.firstName[0]}${tutor.user.lastName[0]}`, color: "bg-blue-600" }}
            profileHref={`/student/tutors/${tutor.id}`}
            onBook={async () => {
              const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
              const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);
              try {
                await authorizedApi("/bookings", { method: "POST", body: JSON.stringify({ tutorId: tutor.user.id, subjectId: tutor.skills[0]?.subjectId, startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString() }) });
                setMessage("Booking created. Fund your wallet, then confirm it from your subscriptions.");
              } catch (error) {
                setMessage(error instanceof Error ? error.message : "Unable to book tutor");
              }
            }}
          />
        ))}
        {!filteredTutors.length && (
          <div className="md:col-span-2 xl:col-span-3">
            <EmptyState
              title={tutors.length ? "No tutors found" : "Build your learning plan"}
              description={tutors.length ? "Try a different name or subject to find a tutor." : "Choose your interests so we can match you with tutors who fit your learning goals."}
              action={tutors.length ? { label: "Clear search", onClick: () => setSearch("") } : { label: "Choose interests", onClick: () => window.location.assign("/student/onboarding") }}
            />
          </div>
        )}
      </div>
      {message && <p className="mt-5 text-sm text-slate-500">{message}</p>}
    </WorkspacePage>
  );
}
