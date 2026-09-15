"use client";

import { useEffect } from "react";

export type ToastData = {
  title: string;
  message: string;
  type?: "success" | "error" | "info";
};

type ToastProps = {
  toast: ToastData | null;
  onClose: () => void;
};

const tone = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(onClose, 5000);
    return () => window.clearTimeout(timeout);
  }, [toast, onClose]);

  if (!toast) return null;
  const type = toast.type ?? "info";

  return (
    <div className="fixed inset-x-4 top-4 z-50 flex justify-center sm:inset-x-auto sm:right-5 sm:top-5 sm:w-full sm:max-w-sm" role="status" aria-live="polite">
      <div className={`flex w-full items-start gap-3 rounded-2xl border p-4 shadow-lg shadow-slate-900/10 ${tone[type]}`}>
        <div className="min-w-0 flex-1">
          {toast.title && <p className="text-sm font-bold">{toast.title}</p>}
          <p className={`${toast.title ? "mt-1 " : ""}text-sm leading-5 opacity-80`}>{toast.message}</p>
        </div>
        <button type="button" onClick={onClose} className="shrink-0 text-lg leading-none opacity-60 hover:opacity-100" aria-label="Close notification">×</button>
      </div>
    </div>
  );
}
