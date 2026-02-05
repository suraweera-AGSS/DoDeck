import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, deleteTask, updateTask } from '../services/task';
import { getUser } from '../services/auth';
import toast, { Toaster } from 'react-hot-toast';
import {
    FaTrash, FaEdit, FaPlus, FaSearch, FaTh, FaList,
    FaFilter, FaSort, FaArrowLeft, FaCheck, FaCheckCircle, FaClock
} from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import TaskModal from '../components/TaskModal';
import ConfirmationModal from '../components/ConfirmationModal';

export default function TaskManagement() {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('date'); // 'date', 'priority', 'title'
    const [selectedTasks, setSelectedTasks] = useState([]);
    const token = localStorage.getItem('token');
    const user = getUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }
        loadTasks();
    }, [token, navigate]);

    useEffect(() => {
        applyFiltersAndSort();
    }, [tasks, searchQuery, filterCategory, filterPriority, filterStatus, sortBy]);

    const loadTasks = async () => {
        try {
            const data = await getTasks(token);
            setTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error('Failed to load tasks');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...tasks];

        // Apply search
        if (searchQuery) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply filters
        if (filterCategory !== 'All') {
            filtered = filtered.filter(task => task.category === filterCategory);
        }
        if (filterPriority !== 'All') {
            filtered = filtered.filter(task => task.priority === filterPriority);
        }
        if (filterStatus !== 'All') {
            filtered = filtered.filter(task => task.status === filterStatus);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'priority') {
                const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            } else if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

        setFilteredTasks(filtered);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const openCreateModal = () => {
        setCurrentTask({
            title: '',
            description: '',
            priority: 'Medium',
            category: 'Work',
            status: 'To Do',
            dueDate: ''
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (task) => {
        setCurrentTask(task);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTask(null);
    };

    const handleSaveTask = async (taskData) => {
        const toastId = toast.loading(isEditing ? 'Updating task...' : 'Creating task...');
        try {
            if (isEditing) {
                await updateTask(currentTask._id, taskData, token);
            } else {
                await createTask(taskData, token);
            }
            loadTasks();
            closeModal();
            toast.success(isEditing ? 'Task updated!' : 'Task created!', { id: toastId });
        } catch (err) {
            toast.error(isEditing ? 'Error updating task' : 'Error creating task', { id: toastId });
        }
    };

    const handleDeleteClick = (id) => {
        setTaskToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return;
        const toastId = toast.loading('Deleting task...');
        try {
            await deleteTask(taskToDelete, token);
            loadTasks();
            toast.success('Task deleted!', { id: toastId });
        } catch (err) {
            toast.error('Error deleting task', { id: toastId });
        }
        setTaskToDelete(null);
        setIsConfirmModalOpen(false);
    };

    const handleQuickComplete = async (task) => {
        const toastId = toast.loading('Marking as complete...');
        try {
            await updateTask(task._id, { ...task, status: 'Completed' }, token);
            loadTasks();
            toast.success('Task completed!', { id: toastId });
        } catch (err) {
            toast.error('Error updating task', { id: toastId });
        }
    };

    const toggleSelectTask = (taskId) => {
        setSelectedTasks(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const handleBulkDelete = async () => {
        if (selectedTasks.length === 0) return;
        const toastId = toast.loading(`Deleting ${selectedTasks.length} tasks...`);
        try {
            await Promise.all(selectedTasks.map(id => deleteTask(id, token)));
            loadTasks();
            setSelectedTasks([]);
            toast.success('Tasks deleted!', { id: toastId });
        } catch (err) {
            toast.error('Error deleting tasks', { id: toastId });
        }
    };

    const handleBulkComplete = async () => {
        if (selectedTasks.length === 0) return;
        const toastId = toast.loading(`Completing ${selectedTasks.length} tasks...`);
        try {
            const tasksToUpdate = tasks.filter(t => selectedTasks.includes(t._id));
            await Promise.all(tasksToUpdate.map(task =>
                updateTask(task._id, { ...task, status: 'Completed' }, token)
            ));
            loadTasks();
            setSelectedTasks([]);
            toast.success('Tasks completed!', { id: toastId });
        } catch (err) {
            toast.error('Error updating tasks', { id: toastId });
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-700';
            case 'Medium': return 'bg-yellow-100 text-yellow-700';
            case 'Low': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <FaCheckCircle className="text-green-500" />;
            case 'In Progress': return <FaClock className="text-blue-500" />;
            default: return <FaClock className="text-gray-400" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-2xl text-gray-600">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Toaster position="top-center" />
            <Sidebar
                isOpen={sidebarOpen}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                handleLogout={handleLogout}
                user={user}
            />
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${sidebarOpen ? 'block' : 'hidden'} md:hidden`} onClick={() => setSidebarOpen(false)}></div>

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-10">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 hover:bg-white rounded-full transition-colors"
                            >
                                <FaArrowLeft size={20} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">📋 Task Management</h1>
                                <p className="text-gray-500">{filteredTasks.length} tasks found</p>
                            </div>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center gap-2"
                        >
                            <FaPlus /> New Task
                        </button>
                    </header>

                    {/* Toolbar */}
                    <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-2">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search tasks..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value="All">All Categories</option>
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Health">Health</option>
                                <option value="Other">Other</option>
                            </select>

                            {/* Priority Filter */}
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value="All">All Priorities</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>

                            {/* Status Filter */}
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value="All">All Status</option>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>

                            {/* View Toggle & Sort */}
                            <div className="flex gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    <option value="date">Date</option>
                                    <option value="priority">Priority</option>
                                    <option value="title">Title</option>
                                </select>
                                <div className="flex gap-1 border border-gray-300 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-yellow-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <FaTh />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-yellow-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <FaList />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedTasks.length > 0 && (
                            <div className="mt-4 flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm font-medium text-blue-700">
                                    {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
                                </span>
                                <button
                                    onClick={handleBulkComplete}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                >
                                    Mark Complete
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setSelectedTasks([])}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Tasks Display */}
                    {filteredTasks.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                            <p className="text-gray-500 text-lg">No tasks found</p>
                            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or create a new task</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        /* Grid View */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTasks.map(task => (
                                <div key={task._id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedTasks.includes(task._id)}
                                                onChange={() => toggleSelectTask(task._id)}
                                                className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500"
                                            />
                                            {getStatusIcon(task.status)}
                                        </div>
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{task.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <span className="px-2 py-1 bg-gray-100 rounded">{task.category}</span>
                                        {task.dueDate && (
                                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {task.status !== 'Completed' && (
                                            <button
                                                onClick={() => handleQuickComplete(task)}
                                                className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                            >
                                                <FaCheck className="inline mr-1" /> Complete
                                            </button>
                                        )}
                                        <button
                                            onClick={() => openEditModal(task)}
                                            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                                        >
                                            <FaEdit className="inline mr-1" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(task._id)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* List View */
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedTasks(filteredTasks.map(t => t._id));
                                                    } else {
                                                        setSelectedTasks([]);
                                                    }
                                                }}
                                                className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredTasks.map(task => (
                                        <tr key={task._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTasks.includes(task._id)}
                                                    onChange={() => toggleSelectTask(task._id)}
                                                    className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(task.status)}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                                        <div className="text-sm text-gray-500 line-clamp-1">{task.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-700">{task.category}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-700">{task.status}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-700">
                                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {task.status !== 'Completed' && (
                                                        <button
                                                            onClick={() => handleQuickComplete(task)}
                                                            className="text-green-600 hover:text-green-800"
                                                            title="Mark Complete"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => openEditModal(task)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(task._id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            {isModalOpen && (
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSave={handleSaveTask}
                    task={currentTask}
                    isEditing={isEditing}
                />
            )}
            {isConfirmModalOpen && (
                <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => {
                        setIsConfirmModalOpen(false);
                        setTaskToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    message="Are you sure you want to delete this task?"
                />
            )}
        </div>
    );
}
