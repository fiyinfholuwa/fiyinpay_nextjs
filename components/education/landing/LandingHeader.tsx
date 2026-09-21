"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Brand from "../Brand";
import { authorizedApi } from "@/lib/api";

export default function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [dashboardPath, setDashboardPath] = useState<string | null>(null);

  useEffect(() => {
    if (!window.localStorage.getItem("daralearn-access-token")) {
      setAuthChecked(true);
      return;
    }

    authorizedApi<{ role: string }>("/auth/me")
      .then((user) => {
        setDashboardPath(
          user.role === "ADMIN"
            ? "/admin/dashboard"
            : user.role === "TUTOR"
              ? "/tutor/dashboard"
              : "/student/dashboard",
        );
      })
      .catch(() => window.localStorage.removeItem("daralearn-access-token"))
      .finally(() => setAuthChecked(true));
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <Brand />

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <a href="#how-it-works" className="hover:text-blue-600">
            How it works
          </a>
          <a href="#tutors" className="hover:text-blue-600">
            Find a tutor
          </a>
          <a href="#why-daralearn" className="hover:text-blue-600">
            Why DaraLearn
          </a>
        </nav>
        <div className="flex items-center gap-2 text-sm font-semibold">
          {authChecked && (dashboardPath ? (
            <Link href={dashboardPath} className="rounded-xl bg-blue-600 px-4 py-2.5 text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700">
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden px-3 py-2 text-slate-600 hover:text-blue-600 sm:block">
                Log in
              </Link>
              <Link href="/register/student" className="hidden rounded-xl bg-blue-600 px-4 py-2.5 text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:block">
                Get started
              </Link>
            </>
          ))}
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setIsMenuOpen((open) => !open)}
            className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 md:hidden"
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-5 flex-col gap-1.5">
              <span className="h-0.5 w-full rounded-full bg-current" />
              <span className="h-0.5 w-full rounded-full bg-current" />
              <span className="h-0.5 w-full rounded-full bg-current" />
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-100 bg-white px-5 py-5 shadow-lg md:hidden sm:px-8"
        >
          <nav className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
            <a
              href="#how-it-works"
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 hover:bg-blue-50 hover:text-blue-600"
            >
              How it works
            </a>
            <a
              href="#tutors"
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 hover:bg-blue-50 hover:text-blue-600"
            >
              Find a tutor
            </a>
            <a
              href="#why-daralearn"
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 hover:bg-blue-50 hover:text-blue-600"
            >
              Why DaraLearn
            </a>
          </nav>
          {authChecked && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              {dashboardPath ? (
                <Link href={dashboardPath} onClick={closeMenu} className="block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700">
                  Go to dashboard
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={closeMenu} className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50">
                    Log in
                  </Link>
                  <Link href="/register/student" onClick={closeMenu} className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700">
                    Get started
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
