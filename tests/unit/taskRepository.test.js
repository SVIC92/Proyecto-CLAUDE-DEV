jest.mock('../../src/lib/supabaseClient', () => ({ from: jest.fn() }));

const supabase = require('../../src/lib/supabaseClient');
const taskRepository = require('../../src/repositories/taskRepository');
const { makeBuilder } = require('../helpers/mockSupabase');

describe('taskRepository (mock del builder de Supabase)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllTasks devuelve las filas cuando Supabase no reporta error', async () => {
    const rows = [{ id: '1', title: 'x' }];
    supabase.from.mockReturnValue(makeBuilder({ data: rows, error: null }));

    const result = await taskRepository.getAllTasks();
    expect(result).toEqual(rows);
  });

  test('traduce un error de Supabase en un ApiError 500', async () => {
    supabase.from.mockReturnValue(
      makeBuilder({ data: null, error: { message: 'connection refused' } })
    );

    await expect(taskRepository.getAllTasks()).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  test('getTaskById devuelve null cuando no hay fila (sin lanzar error)', async () => {
    supabase.from.mockReturnValue(makeBuilder({ data: null, error: null }));

    const result = await taskRepository.getTaskById('inexistente');
    expect(result).toBeNull();
  });
});
