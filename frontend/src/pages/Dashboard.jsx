import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, deleteTask, updateTask } from '../services/task';
import toast, { Toaster } from 'react-hot-toast';
import { FaTrash, FaSignOutAlt, FaBars, FaUserCircle, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
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

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        const toastId = toast.loading('Adding task...');
        try {
            await createTask({ title }, token);
            setTitle('');
            loadTasks();
            toast.success('Task added successfully!', { id: toastId });
        } catch (err) {
            toast.error('Error creating task', { id: toastId });
        }
    };

    const handleDelete = async (id) => {
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
        const toastId = toast.loading('Updating task...');
        try {
            await updateTask(task._id, { completed: !task.completed }, token);
            loadTasks();
            toast.success('Task status updated!', { id: toastId });
        } catch (err) {
            toast.error('Error updating task', { id: toastId });
        }
    };

    const handleEdit = (task) => {
        setEditingTaskId(task._id);
        setEditingTitle(task.title);
    };

    const handleCancelEdit = () => {
        setEditingTaskId(null);
        setEditingTitle('');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingTitle.trim() || !editingTaskId) return;
        const toastId = toast.loading('Saving task...');
        try {
            await updateTask(editingTaskId, { title: editingTitle }, token);
            setEditingTaskId(null);
            setEditingTitle('');
            loadTasks();
            toast.success('Task updated successfully!', { id: toastId });
        } catch (err) {
            toast.error('Error updating task', { id: toastId });
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
                        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                            <form onSubmit={handleAdd} className="flex gap-4">
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="flex-1 p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="What's your next task?"
                                />
                                <Button type="submit" variant="accent">
                                    Add Task
                                </Button>
                            </form>
                        </div>

                        {loading && <p className="text-center">Loading tasks...</p>}

                        <div className="space-y-4">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className={`bg-white p-4 rounded-lg shadow-md flex items-center justify-between transition-all duration-300 ${task.completed ? 'opacity-50' : ''}`}
                                    >
                                        {editingTaskId === task._id ? (
                                            <form onSubmit={handleUpdate} className="flex-1 flex items-center gap-4">
                                                <input
                                                    type="text"
                                                    value={editingTitle}
                                                    onChange={(e) => setEditingTitle(e.target.value)}
                                                    className="flex-1 p-2 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                    autoFocus
                                                />
                                                <button type="submit" className="text-green-500 hover:text-green-600 transition duration-300">
                                                    <FaSave size={18} />
                                                </button>
                                                <button type="button" onClick={handleCancelEdit} className="text-gray-400 hover:text-red-500 transition duration-300">
                                                    <FaTimes size={18} />
                                                </button>
                                            </form>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={task.completed}
                                                        onChange={() => handleToggleComplete(task)}
                                                        className="w-6 h-6 text-yellow-500 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
                                                    />
                                                    <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                                        {task.title}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => handleEdit(task)}
                                                        className="text-gray-400 hover:text-yellow-500 transition duration-300"
                                                    >
                                                        <FaEdit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(task._id)}
                                                        className="text-gray-400 hover:text-red-500 transition duration-300"
                                                    >
                                                        <FaTrash size={18} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
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
