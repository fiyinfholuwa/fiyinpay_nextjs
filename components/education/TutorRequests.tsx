"use client";

import { useEffect, useState } from "react";

export default function TutorRequests() {
  const [requested, setRequested] = useState(false);
  useEffect(() => { setRequested(window.localStorage.getItem("horizon-demo-booking") === "requested"); }, []);
  return <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Booking requests</h2><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">{requested ? "1 new" : "0 new"}</span></div>{requested ? <div className="mt-5 flex items-center justify-between rounded-xl bg-blue-50 p-4"><div><strong className="block text-sm">Fiyinfoluwa</strong><span className="text-xs text-slate-500">Mathematics · Requested today</span></div><button onClick={() => { window.localStorage.setItem("horizon-demo-booking", "accepted"); setRequested(false); }} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">Accept</button></div> : <p className="mt-5 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">New student requests will appear here.</p>}</div>;
}
