import React from 'react';
import { FaTimes } from 'react-icons/fa';
import TaskForm from './TaskForm';

const TaskModal = ({ isOpen, closeModal, task, setTask, handleSubmit, isEditing }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-in-out">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FaTimes size={22} />
                    </button>
                </div>
                <div className="p-6">
                    <TaskForm task={task} setTask={setTask} handleSubmit={handleSubmit} closeModal={closeModal} />
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
