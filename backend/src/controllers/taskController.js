const taskService = require('../services/taskService');
const taskStatsService = require('../services/taskStatsService');
const { validateListQuery } = require('../validators/queryValidator');

async function create(req, res, next) {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const filters = validateListQuery(req.query);
    const tasks = await taskService.listTasks(filters);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
}

async function stats(req, res, next) {
  try {
    const tasks = await taskService.listTasks({});
    res.status(200).json(taskStatsService.computeStats(tasks));
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, stats, getById, update, remove };
