const ApiError = require('../utils/ApiError');
const { isValidIsoDate } = require('../utils/dateUtils');

const STATUS_VALUES = ['pending', 'in_progress', 'done'];
const PRIORITY_VALUES = ['low', 'medium', 'high'];

function validateTitle(title, { required }) {
  if (title === undefined) {
    if (required) {
      throw new ApiError(400, 'title es obligatorio', 'title');
    }
    return undefined;
  }

  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new ApiError(400, 'title no puede estar vacío', 'title');
  }

  if (title.length > 120) {
    throw new ApiError(400, 'title no puede tener más de 120 caracteres', 'title');
  }

  return title;
}

function validateDescription(description) {
  if (description === undefined) {
    return undefined;
  }

  if (typeof description !== 'string') {
    throw new ApiError(400, 'description debe ser un string', 'description');
  }

  if (description.length > 1000) {
    throw new ApiError(400, 'description no puede tener más de 1000 caracteres', 'description');
  }

  return description;
}

function validateStatus(status) {
  if (status === undefined) {
    return undefined;
  }

  if (!STATUS_VALUES.includes(status)) {
    throw new ApiError(
      400,
      `status debe ser uno de: ${STATUS_VALUES.join(', ')}`,
      'status'
    );
  }

  return status;
}

function validatePriority(priority) {
  if (priority === undefined) {
    return undefined;
  }

  if (!PRIORITY_VALUES.includes(priority)) {
    throw new ApiError(
      400,
      `priority debe ser uno de: ${PRIORITY_VALUES.join(', ')}`,
      'priority'
    );
  }

  return priority;
}

function validateDueDate(dueDate) {
  if (dueDate === undefined || dueDate === null) {
    return dueDate;
  }

  if (!isValidIsoDate(dueDate)) {
    throw new ApiError(
      400,
      'due_date debe ser una fecha válida en formato ISO-8601 (YYYY-MM-DD)',
      'due_date'
    );
  }

  return dueDate;
}

function validateCreate(body = {}) {
  const title = validateTitle(body.title, { required: true });
  const description = validateDescription(body.description);
  const status = validateStatus(body.status) ?? 'pending';
  const priority = validatePriority(body.priority) ?? 'medium';
  const dueDate = validateDueDate(body.due_date);

  const result = { title, status, priority };
  if (description !== undefined) result.description = description;
  if (dueDate !== undefined) result.due_date = dueDate;

  return result;
}

function validateUpdate(body = {}) {
  const patch = {};

  if (body.title !== undefined) {
    patch.title = validateTitle(body.title, { required: false });
  }
  if (body.description !== undefined) {
    patch.description = validateDescription(body.description);
  }
  if (body.status !== undefined) {
    patch.status = validateStatus(body.status);
  }
  if (body.priority !== undefined) {
    patch.priority = validatePriority(body.priority);
  }
  if (body.due_date !== undefined) {
    patch.due_date = validateDueDate(body.due_date);
  }

  return patch;
}

module.exports = {
  STATUS_VALUES,
  PRIORITY_VALUES,
  validateCreate,
  validateUpdate,
};
