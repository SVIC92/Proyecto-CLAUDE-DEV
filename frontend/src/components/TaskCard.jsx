import { Badge } from './Badge';
import {
  formatDueDate,
  isOverdue,
  priorityDotClass,
  priorityLabel,
  priorityStyles,
  statusLabel,
  statusStyles,
  STATUS_OPTIONS,
} from '../utils/taskMeta';

export function TaskCard({ task, onEdit, onDelete, onStatusChange, disabled }) {
  const overdue = isOverdue(task);

  return (
    <div className="group rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${priorityDotClass(task.priority)}`} />
            <h3 className="truncate text-base font-semibold text-slate-900">{task.title}</h3>
          </div>

          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{task.description}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className={statusStyles(task.status)}>{statusLabel(task.status)}</Badge>
            <Badge className={priorityStyles(task.priority)}>
              Prioridad {priorityLabel(task.priority).toLowerCase()}
            </Badge>
            <Badge
              className={
                overdue
                  ? 'bg-rose-50 text-rose-600 ring-rose-500/20'
                  : 'bg-slate-50 text-slate-500 ring-slate-500/10'
              }
            >
              {overdue ? '⚠ Vencida · ' : ''}
              {formatDueDate(task.due_date)}
            </Badge>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(task)}
            disabled={disabled}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            title="Editar"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            disabled={disabled}
            className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-3">
        <span className="mr-1 text-xs font-medium text-slate-400">Estado:</span>
        {STATUS_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            disabled={disabled || task.status === o.value}
            onClick={() => onStatusChange(task, o.value)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition disabled:cursor-default ${
              task.status === o.value
                ? statusStyles(o.value) + ' ring-1'
                : 'text-slate-400 hover:bg-slate-100'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
