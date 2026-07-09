jest.mock('../../src/repositories/taskRepository');

const request = require('supertest');
const app = require('../../src/app');
const taskRepository = require('../../src/repositories/taskRepository');

const EXISTING_TASK = {
  id: 'aaaa',
  title: 'Tarea existente',
  description: null,
  status: 'pending',
  priority: 'medium',
  due_date: null,
  created_at: '2026-07-01T00:00:00.000Z',
  updated_at: '2026-07-01T00:00:00.000Z',
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET /tasks/:id', () => {
  test('devuelve 200 con la tarea si existe', async () => {
    taskRepository.getTaskById.mockResolvedValue(EXISTING_TASK);

    const res = await request(app).get(`/tasks/${EXISTING_TASK.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(EXISTING_TASK);
  });

  test('devuelve 404 si el id no existe', async () => {
    taskRepository.getTaskById.mockResolvedValue(null);

    const res = await request(app).get('/tasks/no-existe');

    expect(res.status).toBe(404);
  });
});

describe('PUT/PATCH /tasks/:id', () => {
  test('actualiza la tarea y responde 200 con los datos actualizados', async () => {
    const updated = { ...EXISTING_TASK, status: 'done' };
    taskRepository.updateTask.mockResolvedValue(updated);

    const res = await request(app).patch(`/tasks/${EXISTING_TASK.id}`).send({ status: 'done' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('done');
    expect(taskRepository.updateTask).toHaveBeenCalledWith(EXISTING_TASK.id, { status: 'done' });
  });

  test('devuelve 404 al actualizar un id inexistente', async () => {
    taskRepository.updateTask.mockResolvedValue(null);

    const res = await request(app).patch('/tasks/no-existe').send({ status: 'done' });

    expect(res.status).toBe(404);
  });

  test('PATCH con body vacio es un no-op: responde 200 con la tarea sin modificar', async () => {
    taskRepository.getTaskById.mockResolvedValue(EXISTING_TASK);

    const res = await request(app).patch(`/tasks/${EXISTING_TASK.id}`).send({});

    expect(res.status).toBe(200);
    expect(res.body).toEqual(EXISTING_TASK);
    expect(taskRepository.updateTask).not.toHaveBeenCalled();
  });

  test('ignora el id enviado en el body (el id es inmutable)', async () => {
    const updated = { ...EXISTING_TASK, status: 'done' };
    taskRepository.updateTask.mockResolvedValue(updated);

    await request(app)
      .patch(`/tasks/${EXISTING_TASK.id}`)
      .send({ id: 'otro-id-hackeado', status: 'done' });

    expect(taskRepository.updateTask).toHaveBeenCalledWith(EXISTING_TASK.id, { status: 'done' });
  });

  test('rechaza status invalido en la actualizacion con 400', async () => {
    const res = await request(app)
      .patch(`/tasks/${EXISTING_TASK.id}`)
      .send({ status: 'urgent' });

    expect(res.status).toBe(400);
    expect(res.body.error.field).toBe('status');
  });
});

describe('DELETE /tasks/:id', () => {
  test('elimina la tarea y responde 204', async () => {
    taskRepository.deleteTask.mockResolvedValue(EXISTING_TASK);

    const res = await request(app).delete(`/tasks/${EXISTING_TASK.id}`);

    expect(res.status).toBe(204);
  });

  test('eliminar la misma tarea dos veces responde 404 la segunda vez', async () => {
    taskRepository.deleteTask.mockResolvedValueOnce(EXISTING_TASK);
    taskRepository.deleteTask.mockResolvedValueOnce(null);

    const first = await request(app).delete(`/tasks/${EXISTING_TASK.id}`);
    const second = await request(app).delete(`/tasks/${EXISTING_TASK.id}`);

    expect(first.status).toBe(204);
    expect(second.status).toBe(404);
  });
});
