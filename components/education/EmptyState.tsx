type EmptyStateProps = {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
};

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-blue-50 text-lg font-bold text-blue-600">+</span>
      <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
      {action && <button type="button" onClick={action.onClick} className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">{action.label}</button>}
    </div>
  );
}
