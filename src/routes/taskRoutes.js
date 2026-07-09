const express = require('express');
const controller = require('../controllers/taskController');

const router = express.Router();

// /tasks/stats debe declararse antes de /tasks/:id para que Express
// no interprete "stats" como el valor del parámetro id.
router.get('/tasks/stats', controller.stats);
router.get('/tasks', controller.list);
router.post('/tasks', controller.create);
router.get('/tasks/:id', controller.getById);
router.put('/tasks/:id', controller.update);
router.patch('/tasks/:id', controller.update);
router.delete('/tasks/:id', controller.remove);

module.exports = router;
