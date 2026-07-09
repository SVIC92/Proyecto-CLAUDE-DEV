import { Modal } from './Modal';

export function ConfirmDialog({ title, message, confirmLabel = 'Eliminar', onCancel, onConfirm, busy }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 disabled:opacity-60"
        >
          {busy ? 'Eliminando…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
