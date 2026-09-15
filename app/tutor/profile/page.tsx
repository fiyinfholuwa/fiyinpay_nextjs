"use client";

import { FormEvent, useEffect, useState } from "react";
import Section from "@/components/education/Section";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Subject = { id: string; name: string };

export default function TutorProfilePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [bio, setBio] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [subjectIds, setSubjectIds] = useState<string[]>([]);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    authorizedApi<Subject[]>("/subjects")
      .then(setSubjects)
      .catch((error) => setMessage(error.message));
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    try {
      await authorizedApi("/tutors/me/profile", {
        method: "PATCH",
        body: JSON.stringify({
          bio,
          monthlyRate: Number(monthlyRate),
          subjectIds,
        }),
      });
      setMessage(
        "Profile saved. Submit your certificate for KYC review when ready.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save profile",
      );
    }
  }

  async function submitKyc() {
    try {
      await authorizedApi("/tutors/me/kyc", {
        method: "POST",
        body: JSON.stringify({ certificateUrl }),
      });
      setMessage("KYC submitted for admin review.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to submit KYC",
      );
    }
  }

  return (
    <WorkspacePage
      eyebrow="Tutor workspace"
      title="My profile"
      description="Tell students what you teach and how you can help them."
    >
      <Section title="Profile information">
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold sm:col-span-2">
            About you
            <textarea
              required
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 px-3 py-3"
              placeholder="Describe your teaching approach"
            />
          </label>
          <label className="text-sm font-semibold">
            Monthly price
            <input
              required
              type="number"
              min="0"
              value={monthlyRate}
              onChange={(event) => setMonthlyRate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3"
              placeholder="50000"
            />
          </label>
          <div className="text-sm font-semibold">
            Subjects
            <div className="mt-2 flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <button
                  type="button"
                  key={subject.id}
                  onClick={() =>
                    setSubjectIds((current) =>
                      current.includes(subject.id)
                        ? current.filter((id) => id !== subject.id)
                        : [...current, subject.id],
                    )
                  }
                  className={`rounded-full px-3 py-2 text-xs ${subjectIds.includes(subject.id) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </div>
          <button className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white sm:col-span-2">
            Save profile
          </button>
        </form>
      </Section>
      <Section
        title="KYC verification"
        description="Add a secure URL to your teaching certificate for admin review."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={certificateUrl}
            onChange={(event) => setCertificateUrl(event.target.value)}
            className="flex-1 rounded-xl border border-slate-300 px-3 py-3 text-sm"
            placeholder="https://.../certificate.pdf"
          />
          <button
            type="button"
            onClick={submitKyc}
            className="rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-600"
          >
            Submit for review
          </button>
        </div>
      </Section>
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </WorkspacePage>
  );
}
