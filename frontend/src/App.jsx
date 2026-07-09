import { useState } from 'react';
import { useTaskManager } from './hooks/useTaskManager';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { TaskList } from './components/TaskList';
import { TaskFormModal } from './components/TaskFormModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { ErrorBanner } from './components/ErrorBanner';

export default function App() {
  const {
    filters,
    setFilters,
    tasks,
    stats,
    loading,
    mutating,
    error,
    clearError,
    createTask,
    updateTask,
    removeTask,
  } = useTaskManager();

  const [editingTask, setEditingTask] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);

  async function handleSubmit(payload) {
    if (editingTask) {
      const result = await updateTask(editingTask.id, payload);
      if (result.ok) setEditingTask(null);
      return result;
    }
    const result = await createTask(payload);
    if (result.ok) setCreating(false);
    return result;
  }

  async function handleConfirmDelete() {
    const result = await removeTask(deletingTask.id);
    if (result.ok) setDeletingTask(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <h1 className="text-2xl font-bold text-slate-900">Gestor de tareas</h1>
          <p className="mt-1 text-sm text-slate-500">
            Organiza, filtra y da seguimiento a tus tareas.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        <ErrorBanner message={error} onDismiss={clearError} />

        <StatsBar stats={stats} loading={loading} />

        <FilterBar filters={filters} onChange={setFilters} onNewTask={() => setCreating(true)} />

        <TaskList
          tasks={tasks}
          loading={loading}
          mutating={mutating}
          onEdit={setEditingTask}
          onDelete={setDeletingTask}
          onStatusChange={(task, status) => updateTask(task.id, { status })}
        />
      </main>

      {(creating || editingTask) && (
        <TaskFormModal
          task={editingTask}
          submitting={mutating}
          onClose={() => {
            setCreating(false);
            setEditingTask(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {deletingTask && (
        <ConfirmDialog
          title="Eliminar tarea"
          message={`¿Seguro que quieres eliminar "${deletingTask.title}"? Esta acción no se puede deshacer.`}
          busy={mutating}
          onCancel={() => setDeletingTask(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
