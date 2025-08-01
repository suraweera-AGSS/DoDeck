import React from 'react';
import Button from './Button';

const TaskForm = ({ task, setTask, handleSubmit, closeModal }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={task.title || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    name="description"
                    id="description"
                    value={task.description || ''}
                    onChange={handleChange}
                    rows={4}
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
                        className="mt-1 block w-full p-3 bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        id="category"
                        value={task.category || 'Work'}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
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
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        name="status"
                        id="status"
                        value={task.status || 'To do'}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    >
                        <option value="To do">To do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        value={task.dueDate ? task.dueDate.split('T')[0] : ''}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    />
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
