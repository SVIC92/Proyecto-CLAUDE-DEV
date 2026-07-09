jest.mock('../../src/repositories/taskRepository');

const request = require('supertest');
const app = require('../../src/app');
const taskRepository = require('../../src/repositories/taskRepository');

describe('POST /tasks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('happy path: crea una tarea con solo title y responde 201 con defaults', async () => {
    const createdTask = {
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Comprar leche',
      status: 'pending',
      priority: 'medium',
      created_at: '2026-07-09T10:00:00.000Z',
      updated_at: '2026-07-09T10:00:00.000Z',
    };
    taskRepository.createTask.mockResolvedValue(createdTask);

    const res = await request(app).post('/tasks').send({ title: 'Comprar leche' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(createdTask);
    expect(taskRepository.createTask).toHaveBeenCalledWith({
      title: 'Comprar leche',
      status: 'pending',
      priority: 'medium',
    });
  });

  test('error de validacion: title vacio responde 400 indicando el campo title', async () => {
    const res = await request(app).post('/tasks').send({ title: '   ' });

    expect(res.status).toBe(400);
    expect(res.body.error.field).toBe('title');
    expect(taskRepository.createTask).not.toHaveBeenCalled();
  });

  test('error de validacion: title ausente responde 400', async () => {
    const res = await request(app).post('/tasks').send({});

    expect(res.status).toBe(400);
    expect(res.body.error.field).toBe('title');
  });

  test('error de validacion: title de mas de 120 caracteres responde 400', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'a'.repeat(121) });

    expect(res.status).toBe(400);
    expect(res.body.error.field).toBe('title');
  });

  test('error de validacion: status fuera del enum responde 400', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'x', status: 'urgent' });

    expect(res.status).toBe(400);
    expect(res.body.error.field).toBe('status');
  });

  test('error de validacion: due_date con fecha inexistente responde 400', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'x', due_date: '2026-02-30' });

    expect(res.status).toBe(400);
    expect(res.body.error.field).toBe('due_date');
  });
});
