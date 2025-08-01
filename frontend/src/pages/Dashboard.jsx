import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, deleteTask, updateTask } from '../services/task';
import toast, { Toaster } from 'react-hot-toast';
import { FaTrash, FaSignOutAlt, FaBars, FaUserCircle, FaEdit, FaPlus } from 'react-icons/fa';
import ConfirmationModal from '../components/ConfirmationModal';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import TaskModal from '../components/TaskModal';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const loadTasks = async () => {
        try {
            const res = await getTasks(token);
            setTasks(res.data);
        } catch (err) {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    

        const handleConfirmDelete = async () => {
        if (!taskToDelete) return;

        const id = taskToDelete;
        setTaskToDelete(null);
        setIsConfirmModalOpen(false);
        const toastId = toast.loading('Deleting task...');
        try {
            await deleteTask(id, token);
            loadTasks();
            toast.success('Task deleted successfully!', { id: toastId });
        } catch (err) {
            toast.error('Error deleting task', { id: toastId });
        }
    };

    const handleToggleComplete = async (task) => {
        const newStatus = task.status === 'Completed' ? 'To do' : 'Completed';
        const toastId = toast.loading('Updating task status...');
        try {
            await updateTask(task._id, { status: newStatus }, token);
            loadTasks();
            toast.success('Task status updated!', { id: toastId });
        } catch (err) {
            toast.error('Error updating task', { id: toastId });
        }
    };

    

    const openModalForCreate = () => {
        setCurrentTask({
            title: '',
            description: '',
            priority: 'Medium',
            category: 'Work',
            status: 'To do',
            dueDate: ''
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openConfirmModal = (id) => {
        setTaskToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setTaskToDelete(null);
        setIsConfirmModalOpen(false);
    };

    const openModalForEdit = (task) => {
        setCurrentTask(task);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTask(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading(isEditing ? 'Updating task...' : 'Creating task...');
        try {
            if (isEditing) {
                await updateTask(currentTask._id, currentTask, token);
            } else {
                await createTask(currentTask, token);
            }
            loadTasks();
            closeModal();
            toast.success(isEditing ? 'Task updated successfully!' : 'Task created successfully!', { id: toastId });
        } catch (err) {
            toast.error(isEditing ? 'Error updating task' : 'Error creating task', { id: toastId });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }
        loadTasks();
    }, [token, navigate]);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <ConfirmationModal 
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirmDelete}
                title="Delete Task?"
                message="Are you sure you want to delete this task? This action cannot be undone."
            />
            <TaskModal 
                isOpen={isModalOpen} 
                closeModal={closeModal} 
                task={currentTask} 
                setTask={setCurrentTask} 
                handleSubmit={handleSubmit} 
                isEditing={isEditing} 
            />
            <Toaster 
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    success: {
                        style: {
                            background: '#FFAB00',
                            color: '#000',
                        },
                        iconTheme: {
                            primary: '#000',
                            secondary: '#FFAB00',
                        },
                    },
                    error: {
                        style: {
                            background: '#EF4444',
                            color: '#fff',
                        },
                    },
                }}
            />
            <Sidebar isOpen={sidebarOpen} isExpanded={isExpanded} setIsExpanded={setIsExpanded} handleLogout={handleLogout} />
            <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
                <header className="bg-white shadow-md p-4 flex justify-between items-center">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 md:hidden">
                        <FaBars size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-black ml-4">DoDeck</h1>
                    <div className="flex items-center gap-4">
                        <FaUserCircle size={32} className="text-gray-600" />
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <Button onClick={openModalForCreate} variant="accent" className="w-full flex items-center justify-center gap-2">
                                <FaPlus />
                                Create New Task
                            </Button>
                        </div>

                        

                        <div className="space-y-4">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <div key={task._id} className={`bg-white p-5 rounded-lg shadow-md transition-all duration-300 ${task.status === 'Completed' ? 'opacity-60' : ''}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={task.status === 'Completed'}
                                                        onChange={() => handleToggleComplete(task)}
                                                        className="w-5 h-5 text-yellow-500 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 cursor-pointer"
                                                    />
                                                    <h3 className={`text-xl font-bold ${task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.title}</h3>
                                                </div>
                                                <p className="text-gray-600 mt-2 ml-8">{task.description}</p>
                                                <div className="flex items-center flex-wrap gap-4 mt-3 ml-8 text-sm">
                                                    <span className={`px-3 py-1 rounded-full font-semibold text-xs ${task.priority === 'High' ? 'bg-red-100 text-red-700' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                        {task.priority}
                                                    </span>
                                                    <span className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-xs">{task.category}</span>
                                                    {task.dueDate && <span className="text-gray-500 font-medium">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => openModalForEdit(task)} className="text-gray-400 hover:text-yellow-500 transition-colors"><FaEdit size={18} /></button>
                                                <button onClick={() => openConfirmModal(task._id)} className="text-gray-400 hover:text-red-500 transition-colors"><FaTrash size={18} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                !loading && (
                                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                                        <p className="text-gray-400 text-lg mb-2">No tasks yet!</p>
                                        <p className="text-gray-500">Add your first task above to get started.</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
