import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, deleteTask, updateTask } from '../services/task';
import { FaTrash, FaSignOutAlt, FaBars, FaUserCircle } from 'react-icons/fa';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const loadTasks = async () => {
        try {
            const res = await getTasks(token);
            setTasks(res.data);
        } catch (err) {
            setError('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            await createTask({ text }, token);
            setText('');
            loadTasks();
        } catch (err) {
            setError('Error creating task');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTask(id, token);
            loadTasks();
        } catch (err) {
            setError('Error deleting task');
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            await updateTask(task._id, { completed: !task.completed }, token);
            loadTasks();
        } catch (err) {
            setError('Error updating task');
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
            <Sidebar isOpen={sidebarOpen} />
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-md p-4 flex justify-between items-center">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 md:hidden">
                        <FaBars size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-black ml-4">DoDeck</h1>
                    <div className="flex items-center gap-4">
                        <FaUserCircle size={32} className="text-gray-600" />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                        >
                            <FaSignOutAlt />
                            <span className="hidden sm:inline">Sign out</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                            <form onSubmit={handleAdd} className="flex gap-4">
                                <input
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="flex-1 p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="What's your next task?"
                                />
                                <Button type="submit" variant="accent">
                                    Add Task
                                </Button>
                            </form>
                        </div>

                        {loading && <p className="text-center">Loading tasks...</p>}
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                        <div className="space-y-4">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className={`bg-white p-4 rounded-lg shadow-md flex items-center justify-between transition-all duration-300 ${task.completed ? 'opacity-50' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => handleToggleComplete(task)}
                                                className="w-6 h-6 text-yellow-500 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
                                            />
                                            <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                                {task.text}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(task._id)}
                                            className="text-gray-400 hover:text-red-500 transition duration-300"
                                        >
                                            <FaTrash size={18} />
                                        </button>
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
