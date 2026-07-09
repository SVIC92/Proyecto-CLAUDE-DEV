const CARD_CONFIG = [
  { key: 'total', label: 'Total de tareas', accent: 'text-slate-900', ring: 'ring-slate-200' },
  {
    key: 'pending',
    label: 'Pendientes',
    accent: 'text-slate-600',
    ring: 'ring-slate-200',
    from: (s) => s.byStatus.pending,
  },
  {
    key: 'in_progress',
    label: 'En progreso',
    accent: 'text-amber-600',
    ring: 'ring-amber-200',
    from: (s) => s.byStatus.in_progress,
  },
  {
    key: 'done',
    label: 'Completadas',
    accent: 'text-emerald-600',
    ring: 'ring-emerald-200',
    from: (s) => s.byStatus.done,
  },
  {
    key: 'overdue',
    label: 'Vencidas',
    accent: 'text-rose-600',
    ring: 'ring-rose-200',
    from: (s) => s.overdue,
  },
];

function StatCardSkeleton() {
  return (
    <div className="h-24 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />
  );
}

export function StatsBar({ stats, loading }) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CARD_CONFIG.map((c) => (
          <StatCardSkeleton key={c.key} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {CARD_CONFIG.map((c) => {
        const value = c.key === 'total' ? stats.total : c.from(stats);
        return (
          <div
            key={c.key}
            className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ${c.ring} transition hover:shadow-md`}
          >
            <p className="text-sm font-medium text-slate-500">{c.label}</p>
            <p className={`mt-1 text-2xl font-semibold tabular-nums ${c.accent}`}>{value}</p>
          </div>
        );
      })}
    </div>
  );
}
