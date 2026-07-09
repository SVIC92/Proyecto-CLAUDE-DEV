const { validateListQuery } = require('../../src/validators/queryValidator');

describe('queryValidator.validateListQuery', () => {
  test('devuelve defaults cuando no se envia ningun parametro', () => {
    expect(validateListQuery({})).toEqual({
      status: undefined,
      priority: undefined,
      sort: 'created_at',
      order: 'asc',
    });
  });

  test('acepta una combinacion valida de filtros', () => {
    const result = validateListQuery({
      status: 'done',
      priority: 'high',
      sort: 'due_date',
      order: 'desc',
    });
    expect(result).toEqual({
      status: 'done',
      priority: 'high',
      sort: 'due_date',
      order: 'desc',
    });
  });

  test('rechaza status fuera del enum en el filtro', () => {
    expect(() => validateListQuery({ status: 'foo' })).toThrow(/status/);
  });

  test('rechaza priority fuera del enum en el filtro', () => {
    expect(() => validateListQuery({ priority: 'foo' })).toThrow(/priority/);
  });

  test('rechaza sort no soportado', () => {
    expect(() => validateListQuery({ sort: 'title' })).toThrow(/sort/);
  });

  test('rechaza order invalido', () => {
    expect(() => validateListQuery({ order: 'sideways' })).toThrow(/order/);
  });
});
