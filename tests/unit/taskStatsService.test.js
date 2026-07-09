const { computeStats } = require('../../src/services/taskStatsService');
const { todayIso } = require('../../src/utils/dateUtils');

describe('taskStatsService.computeStats', () => {
  test('con un arreglo vacio, todos los contadores quedan en cero', () => {
    expect(computeStats([])).toEqual({
      total: 0,
      byStatus: { pending: 0, in_progress: 0, done: 0 },
      byPriority: { low: 0, medium: 0, high: 0 },
      overdue: 0,
    });
  });

  test('una tarea con due_date igual a hoy no se cuenta como vencida', () => {
    const stats = computeStats([
      { status: 'pending', priority: 'medium', due_date: todayIso() },
    ]);
    expect(stats.overdue).toBe(0);
  });

  test('una tarea vencida pero con status done no se cuenta como vencida', () => {
    const stats = computeStats([
      { status: 'done', priority: 'low', due_date: '2000-01-01' },
    ]);
    expect(stats.overdue).toBe(0);
  });

  test('calcula total, byStatus, byPriority y overdue correctamente', () => {
    const tasks = [
      { status: 'pending', priority: 'high', due_date: '2000-01-01' }, // vencida
      { status: 'in_progress', priority: 'low', due_date: null },
      { status: 'done', priority: 'medium', due_date: '2000-01-01' }, // done, no cuenta
    ];
    const stats = computeStats(tasks);

    expect(stats.total).toBe(3);
    expect(stats.byStatus).toEqual({ pending: 1, in_progress: 1, done: 1 });
    expect(stats.byPriority).toEqual({ low: 1, medium: 1, high: 1 });
    expect(stats.overdue).toBe(1);
  });
});
