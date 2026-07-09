jest.mock('../../src/repositories/taskRepository');

const request = require('supertest');
const app = require('../../src/app');
const taskRepository = require('../../src/repositories/taskRepository');
const { todayIso } = require('../../src/utils/dateUtils');

const FIXTURE = [
  {
    id: 'a',
    title: 'A',
    status: 'pending',
    priority: 'low',
    due_date: '2000-01-01', // vencida
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'b',
    title: 'B',
    status: 'in_progress',
    priority: 'high',
    due_date: todayIso(), // vence hoy: no cuenta como vencida
    created_at: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'c',
    title: 'C',
    status: 'done',
    priority: 'medium',
    due_date: '2000-01-01', // done: no cuenta como vencida aunque la fecha ya pasó
    created_at: '2026-01-03T00:00:00.000Z',
  },
  {
    id: 'd',
    title: 'D',
    status: 'pending',
    priority: 'high',
    due_date: null, // sin fecha limite
    created_at: '2026-01-04T00:00:00.000Z',
  },
];

describe('GET /tasks/stats (happy path del endpoint con logica propia)', () => {
  beforeEach(() => {
    taskRepository.getAllTasks.mockResolvedValue(FIXTURE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('devuelve total, byStatus, byPriority y overdue coherentes con el fixture', async () => {
    const res = await request(app).get('/tasks/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      total: 4,
      byStatus: { pending: 2, in_progress: 1, done: 1 },
      byPriority: { low: 1, medium: 1, high: 2 },
      overdue: 1,
    });
  });
});

describe('GET /tasks (filtro + orden)', () => {
  beforeEach(() => {
    taskRepository.getAllTasks.mockResolvedValue(FIXTURE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('filtra por status y ordena por due_date asc (sin fecha al final)', async () => {
    const res = await request(app).get('/tasks?status=pending&sort=due_date&order=asc');

    expect(res.status).toBe(200);
    expect(res.body.map((t) => t.id)).toEqual(['a', 'd']);
  });

  test('rechaza un status de filtro fuera del enum con 400', async () => {
    const res = await request(app).get('/tasks?status=foo');

    expect(res.status).toBe(400);
    expect(res.body.error.field).toBe('status');
  });

  test('rechaza un sort no soportado con 400', async () => {
    const res = await request(app).get('/tasks?sort=title');

    expect(res.status).toBe(400);
    expect(res.body.error.field).toBe('sort');
  });
});
