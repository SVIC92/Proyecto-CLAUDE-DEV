export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'done', label: 'Completada' },
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
];

export const SORT_OPTIONS = [
  { value: 'created_at', label: 'Fecha de creación' },
  { value: 'due_date', label: 'Fecha límite' },
  { value: 'priority', label: 'Prioridad' },
];

const STATUS_STYLES = {
  pending: 'bg-slate-100 text-slate-600 ring-slate-500/15',
  in_progress: 'bg-amber-100 text-amber-700 ring-amber-600/20',
  done: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
};

const PRIORITY_STYLES = {
  low: 'bg-sky-100 text-sky-700 ring-sky-600/20',
  medium: 'bg-amber-100 text-amber-700 ring-amber-600/20',
  high: 'bg-rose-100 text-rose-700 ring-rose-600/20',
};

const PRIORITY_DOT = {
  low: 'bg-sky-500',
  medium: 'bg-amber-500',
  high: 'bg-rose-500',
};

export function statusLabel(value) {
  return STATUS_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function priorityLabel(value) {
  return PRIORITY_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function statusStyles(value) {
  return STATUS_STYLES[value] ?? STATUS_STYLES.pending;
}

export function priorityStyles(value) {
  return PRIORITY_STYLES[value] ?? PRIORITY_STYLES.medium;
}

export function priorityDotClass(value) {
  return PRIORITY_DOT[value] ?? PRIORITY_DOT.medium;
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function isOverdue(task) {
  return Boolean(task.due_date) && task.status !== 'done' && task.due_date < todayIso();
}

export function formatDueDate(dueDate) {
  if (!dueDate) return 'Sin fecha límite';
  const [year, month, day] = dueDate.split('-');
  return `${day}/${month}/${year}`;
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
