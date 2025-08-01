const Task = require('../models/Task');

// CREATE Task
exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, category, status } = req.body;
        const newTask = new Task({
            userId: req.userId,
            title,
            description,
            dueDate,
            priority,
            category,
            status
        });
        await newTask.save();
        res.status(201).json({ message: 'Task created', task: newTask });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET All Tasks for Logged-In User
exports.getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// UPDATE Task
exports.updateTask = async (req, res) => {
    try {
        const updated = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task updated', task: updated });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// DELETE Task
exports.deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        if (!deleted) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
