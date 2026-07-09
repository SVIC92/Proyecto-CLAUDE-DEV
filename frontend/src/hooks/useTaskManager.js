import { useCallback, useEffect, useState } from 'react';
import { tasksApi } from '../api/tasksApi';

const DEFAULT_FILTERS = { status: '', priority: '', sort: 'created_at', order: 'asc' };

export function useTaskManager() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mutating, setMutating] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [taskList, taskStats] = await Promise.all([
        tasksApi.list(filters),
        tasksApi.stats(),
      ]);
      setTasks(taskList);
      setStats(taskStats);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const runMutation = useCallback(
    async (fn) => {
      setMutating(true);
      setError(null);
      try {
        await fn();
        await refetch();
        return { ok: true };
      } catch (err) {
        setError(err.message || 'Ocurrió un error inesperado');
        return { ok: false, error: err };
      } finally {
        setMutating(false);
      }
    },
    [refetch]
  );

  const createTask = useCallback((payload) => runMutation(() => tasksApi.create(payload)), [
    runMutation,
  ]);

  const updateTask = useCallback(
    (id, patch) => runMutation(() => tasksApi.update(id, patch)),
    [runMutation]
  );

  const removeTask = useCallback((id) => runMutation(() => tasksApi.remove(id)), [runMutation]);

  return {
    filters,
    setFilters,
    tasks,
    stats,
    loading,
    mutating,
    error,
    clearError: () => setError(null),
    createTask,
    updateTask,
    removeTask,
    refetch,
  };
}
