import { TaskCard } from './TaskCard';

function TaskCardSkeleton() {
  return <div className="h-40 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />;
}

export function TaskList({ tasks, loading, mutating, onEdit, onDelete, onStatusChange }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center ring-1 ring-slate-200">
        <p className="text-4xl">📝</p>
        <p className="mt-3 text-sm font-medium text-slate-600">
          No hay tareas que coincidan con estos filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          disabled={mutating}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
