const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {createTask,getUserTasks,updateTask,deleteTask} = require('../controllers/taskController');

// Protect all routes
router.use(authMiddleware);

// Task routes
router.post('/', createTask);
router.get('/', getUserTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
