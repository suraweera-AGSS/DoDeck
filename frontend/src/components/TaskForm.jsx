import React, { useState } from 'react';
import Button from './Button';

const TaskForm = ({ task, setTask, handleSubmit, closeModal }) => {
    const [errors, setErrors] = useState({});
    const isEditing = task && task._id;
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        // Title is mandatory
        if (!task.title || task.title.trim() === '') {
            newErrors.title = 'Title is required';
        }
        
        // Priority is mandatory
        if (!task.priority) {
            newErrors.priority = 'Priority is required';
        }
        
        // Category is mandatory
        if (!task.category) {
            newErrors.category = 'Category is required';
        }
        
        // Status is mandatory
        if (!task.status) {
            newErrors.status = 'Status is required';
        }
        
        // Due date validation - cannot be in the past
        if (task.dueDate && task.dueDate < today) {
            newErrors.dueDate = 'Due date cannot be in the past';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={task.title || ''}
                    onChange={handleChange}
                    className={`mt-1 block w-full p-3 bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm ${errors.title ? 'border-red-500' : ''}`}
                    required
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    name="description"
                    id="description"
                    value={task.description || ''}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1 block w-full p-3 bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                        name="priority"
                        id="priority"
                        value={task.priority || 'Medium'}
                        onChange={handleChange}
                        className={`mt-1 block w-full p-3 bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm ${errors.priority ? 'border-red-500' : ''}`}
                        required
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority}</p>}
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        id="category"
                        value={task.category || 'Work'}
                        onChange={handleChange}
                        className={`mt-1 block w-full p-3 bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm ${errors.category ? 'border-red-500' : ''}`}
                        required
                    >
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Health & Fitness">Health & Fitness</option>
                        <option value="Home">Home</option>
                        <option value="Finance">Finance</option>
                        <option value="Education">Education</option>
                        <option value="Social">Social</option>
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        name="status"
                        id="status"
                        value={task.status || 'To Do'}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`mt-1 block w-full p-3 bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm ${errors.status ? 'border-red-500' : ''} ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        required
                    >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                    {!isEditing && <p className="mt-1 text-sm text-gray-500">Status is set to "To Do" for new tasks</p>}
                </div>
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        value={task.dueDate ? task.dueDate.split('T')[0] : ''}
                        onChange={handleChange}
                        min={today}
                        className={`mt-1 block w-full p-3 bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm ${errors.dueDate ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
                <Button type="submit" variant="accent">Save Task</Button>
            </div>
        </form>
    );
};

export default TaskForm;
