const taskRepository = require('../repositories/taskRepository');
const { validateCreate, validateUpdate } = require('../validators/taskValidator');
const ApiError = require('../utils/ApiError');

const PRIORITY_RANK = { low: 0, medium: 1, high: 2 };

function compareByField(a, b, sort) {
  if (sort === 'priority') {
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  }

  if (sort === 'due_date') {
    if (a.due_date == null && b.due_date == null) return 0;
    if (a.due_date == null) return 1;
    if (b.due_date == null) return -1;
    return a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0;
  }

  // created_at
  return a.created_at < b.created_at ? -1 : a.created_at > b.created_at ? 1 : 0;
}

function sortTasks(tasks, sort, order) {
  const sorted = [...tasks].sort((a, b) => {
    const base = compareByField(a, b, sort);

    // Las tareas sin due_date siempre van al final, sin importar el order.
    if (sort === 'due_date' && (a.due_date == null || b.due_date == null)) {
      return base;
    }

    return order === 'desc' ? -base : base;
  });

  return sorted;
}

function filterTasks(tasks, { status, priority }) {
  return tasks.filter(
    (task) =>
      (status === undefined || task.status === status) &&
      (priority === undefined || task.priority === priority)
  );
}

async function createTask(body) {
  const taskData = validateCreate(body);
  return taskRepository.createTask(taskData);
}

async function listTasks(filters = {}) {
  const { status, priority, sort = 'created_at', order = 'asc' } = filters;
  const tasks = await taskRepository.getAllTasks();
  const filtered = filterTasks(tasks, { status, priority });
  return sortTasks(filtered, sort, order);
}

async function getTaskById(id) {
  const task = await taskRepository.getTaskById(id);
  if (!task) {
    throw new ApiError(404, `No existe una tarea con id ${id}`);
  }
  return task;
}

async function updateTask(id, body) {
  const patch = validateUpdate(body);

  if (Object.keys(patch).length === 0) {
    return getTaskById(id);
  }

  const updated = await taskRepository.updateTask(id, patch);
  if (!updated) {
    throw new ApiError(404, `No existe una tarea con id ${id}`);
  }
  return updated;
}

async function deleteTask(id) {
  const deleted = await taskRepository.deleteTask(id);
  if (!deleted) {
    throw new ApiError(404, `No existe una tarea con id ${id}`);
  }
  return deleted;
}

module.exports = {
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
