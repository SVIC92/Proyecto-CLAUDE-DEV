const ApiError = require('../utils/ApiError');
const { STATUS_VALUES, PRIORITY_VALUES } = require('./taskValidator');

const SORT_FIELDS = ['due_date', 'priority', 'created_at'];
const ORDER_VALUES = ['asc', 'desc'];

function validateListQuery(query = {}) {
  const result = {
    status: undefined,
    priority: undefined,
    sort: 'created_at',
    order: 'asc',
  };

  if (query.status !== undefined) {
    if (!STATUS_VALUES.includes(query.status)) {
      throw new ApiError(
        400,
        `status debe ser uno de: ${STATUS_VALUES.join(', ')}`,
        'status'
      );
    }
    result.status = query.status;
  }

  if (query.priority !== undefined) {
    if (!PRIORITY_VALUES.includes(query.priority)) {
      throw new ApiError(
        400,
        `priority debe ser uno de: ${PRIORITY_VALUES.join(', ')}`,
        'priority'
      );
    }
    result.priority = query.priority;
  }

  if (query.sort !== undefined) {
    if (!SORT_FIELDS.includes(query.sort)) {
      throw new ApiError(
        400,
        `sort debe ser uno de: ${SORT_FIELDS.join(', ')}`,
        'sort'
      );
    }
    result.sort = query.sort;
  }

  if (query.order !== undefined) {
    if (!ORDER_VALUES.includes(query.order)) {
      throw new ApiError(
        400,
        `order debe ser uno de: ${ORDER_VALUES.join(', ')}`,
        'order'
      );
    }
    result.order = query.order;
  }

  return result;
}

module.exports = { validateListQuery, SORT_FIELDS, ORDER_VALUES };
