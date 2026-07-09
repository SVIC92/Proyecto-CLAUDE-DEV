const { STATUS_VALUES, PRIORITY_VALUES } = require('../validators/taskValidator');
const { isPastDate, todayIso } = require('../utils/dateUtils');

function computeStats(tasks) {
  const today = todayIso();

  const byStatus = Object.fromEntries(STATUS_VALUES.map((s) => [s, 0]));
  const byPriority = Object.fromEntries(PRIORITY_VALUES.map((p) => [p, 0]));
  let overdue = 0;

  for (const task of tasks) {
    byStatus[task.status] += 1;
    byPriority[task.priority] += 1;

    if (task.due_date && task.status !== 'done' && isPastDate(task.due_date, today)) {
      overdue += 1;
    }
  }

  return {
    total: tasks.length,
    byStatus,
    byPriority,
    overdue,
  };
}

module.exports = { computeStats };
