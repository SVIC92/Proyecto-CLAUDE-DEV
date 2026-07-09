const { validateCreate, validateUpdate } = require('../../src/validators/taskValidator');

describe('taskValidator.validateCreate', () => {
  test('acepta un payload valido con solo title y aplica defaults', () => {
    const result = validateCreate({ title: 'Comprar leche' });
    expect(result).toEqual({
      title: 'Comprar leche',
      status: 'pending',
      priority: 'medium',
    });
  });

  test('rechaza title ausente', () => {
    expect(() => validateCreate({})).toThrow(/title/);
  });

  test('rechaza title compuesto solo de espacios', () => {
    expect(() => validateCreate({ title: '   ' })).toThrow(/title/);
  });

  test('rechaza title de mas de 120 caracteres', () => {
    expect(() => validateCreate({ title: 'a'.repeat(121) })).toThrow(/120/);
  });

  test('rechaza status fuera del enum', () => {
    expect(() => validateCreate({ title: 'x', status: 'urgent' })).toThrow(/status/);
  });

  test('rechaza priority fuera del enum', () => {
    expect(() => validateCreate({ title: 'x', priority: 'critical' })).toThrow(/priority/);
  });

  test('rechaza due_date con fecha inexistente', () => {
    expect(() => validateCreate({ title: 'x', due_date: '2026-02-30' })).toThrow(/due_date/);
  });

  test('rechaza due_date con formato no ISO-8601', () => {
    expect(() => validateCreate({ title: 'x', due_date: '09/07/2026' })).toThrow(/due_date/);
  });

  test('nunca copia id, created_at ni updated_at del body', () => {
    const result = validateCreate({
      title: 'x',
      id: 'hackeado',
      created_at: '2000-01-01T00:00:00.000Z',
      updated_at: '2000-01-01T00:00:00.000Z',
    });
    expect(result.id).toBeUndefined();
    expect(result.created_at).toBeUndefined();
    expect(result.updated_at).toBeUndefined();
  });
});

describe('taskValidator.validateUpdate', () => {
  test('permite un body vacio sin lanzar error', () => {
    expect(() => validateUpdate({})).not.toThrow();
    expect(validateUpdate({})).toEqual({});
  });

  test('valida solo los campos presentes', () => {
    const result = validateUpdate({ status: 'done' });
    expect(result).toEqual({ status: 'done' });
  });

  test('rechaza title vacio si se envia explicitamente', () => {
    expect(() => validateUpdate({ title: '' })).toThrow(/title/);
  });

  test('ignora el id aunque se envie en el body', () => {
    const result = validateUpdate({ id: 'hackeado', status: 'done' });
    expect(result.id).toBeUndefined();
  });
});
