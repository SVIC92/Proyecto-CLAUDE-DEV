import { useState } from 'react';
import { Modal } from './Modal';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../utils/taskMeta';

const inputClass =
  'mt-1 block w-full rounded-lg border-0 bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none';

function emptyForm() {
  return { title: '', description: '', status: 'pending', priority: 'medium', due_date: '' };
}

export function TaskFormModal({ task, onClose, onSubmit, submitting }) {
  const isEdit = Boolean(task);
  const [form, setForm] = useState(() =>
    task
      ? {
          title: task.title,
          description: task.description ?? '',
          status: task.status,
          priority: task.priority,
          due_date: task.due_date ?? '',
        }
      : emptyForm()
  );
  const [fieldError, setFieldError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldError(null);

    const payload = {
      title: form.title,
      description: form.description || undefined,
      status: form.status,
      priority: form.priority,
      due_date: form.due_date || undefined,
    };

    const result = await onSubmit(payload);
    if (!result.ok) {
      setFieldError(result.error?.field ? { field: result.error.field, message: result.error.message } : null);
    }
  }

  return (
    <Modal title={isEdit ? 'Editar tarea' : 'Nueva tarea'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Título</label>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            maxLength={120}
            autoFocus
          />
          {fieldError?.field === 'title' && (
            <p className="mt-1 text-xs text-rose-600">{fieldError.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Descripción</label>
          <textarea
            className={inputClass}
            rows={3}
            maxLength={1000}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
          {fieldError?.field === 'description' && (
            <p className="mt-1 text-xs text-rose-600">{fieldError.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Estado</label>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Prioridad</label>
            <select
              className={inputClass}
              value={form.priority}
              onChange={(e) => update('priority', e.target.value)}
            >
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Fecha límite</label>
          <input
            type="date"
            className={inputClass}
            value={form.due_date}
            onChange={(e) => update('due_date', e.target.value)}
          />
          {fieldError?.field === 'due_date' && (
            <p className="mt-1 text-xs text-rose-600">{fieldError.message}</p>
          )}
        </div>

        {fieldError && !['title', 'description', 'due_date'].includes(fieldError.field) && (
          <p className="text-sm text-rose-600">{fieldError.message}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60"
          >
            {submitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear tarea'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
