const supabase = require('../lib/supabaseClient');
const ApiError = require('../utils/ApiError');

function assertNoError(error, action) {
  if (error) {
    throw new ApiError(500, `Error de Supabase al ${action}: ${error.message}`);
  }
}

async function createTask(taskData) {
  const { data, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select()
    .single();

  assertNoError(error, 'crear la tarea');
  return data;
}

async function getAllTasks() {
  const { data, error } = await supabase.from('tasks').select('*');

  assertNoError(error, 'listar las tareas');
  return data;
}

async function getTaskById(id) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  assertNoError(error, 'obtener la tarea');
  return data;
}

async function updateTask(id, patch) {
  const { data, error } = await supabase
    .from('tasks')
    .update(patch)
    .eq('id', id)
    .select()
    .maybeSingle();

  assertNoError(error, 'actualizar la tarea');
  return data;
}

async function deleteTask(id) {
  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .select()
    .maybeSingle();

  assertNoError(error, 'eliminar la tarea');
  return data;
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
