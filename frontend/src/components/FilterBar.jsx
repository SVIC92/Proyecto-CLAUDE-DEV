import { PRIORITY_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from '../utils/taskMeta';

const selectClass =
  'rounded-lg border-0 bg-slate-100 py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none';

export function FilterBar({ filters, onChange, onNewTask }) {
  function update(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <select
          className={selectClass}
          value={filters.status}
          onChange={(e) => update('status', e.target.value)}
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={filters.priority}
          onChange={(e) => update('priority', e.target.value)}
        >
          <option value="">Toda prioridad</option>
          {PRIORITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={filters.sort}
          onChange={(e) => update('sort', e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Ordenar por {o.label.toLowerCase()}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => update('order', filters.order === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          title="Invertir orden"
        >
          {filters.order === 'asc' ? '↑ Ascendente' : '↓ Descendente'}
        </button>
      </div>

      <button
        type="button"
        onClick={onNewTask}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:bg-indigo-700"
      >
        + Nueva tarea
      </button>
    </div>
  );
}
