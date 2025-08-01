import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import TaskForm from './TaskForm';

const TaskModal = ({ isOpen, onClose, onSubmit, task: initialTask, isEditing }) => {
    const modalRef = useRef();
    const [task, setTask] = useState(initialTask || {});

    // Reset form when task changes or modal is opened/closed
    useEffect(() => {
        setTask(initialTask || {});
    }, [initialTask, isOpen]);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(e, task);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
            <div 
                ref={modalRef}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isEditing ? 'Edit Task' : 'Add New Task'}
                    </h2>
                    <button 
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>
                <div className="p-6">
                    <TaskForm 
                        task={task} 
                        setTask={setTask} 
                        handleSubmit={handleFormSubmit} 
                        closeModal={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
