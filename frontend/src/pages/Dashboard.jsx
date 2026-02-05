import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, deleteTask, updateTask } from '../services/task';
import { getUser } from '../services/auth';
import toast, { Toaster } from 'react-hot-toast';
import { FaTrash, FaSignOutAlt, FaBars, FaUserCircle, FaEdit, FaPlus, FaSearch, FaQuestionCircle } from 'react-icons/fa';
import ConfirmationModal from '../components/ConfirmationModal';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import TaskModal from '../components/TaskModal';
import Calendar from '../components/Calendar';
import TutorialGuide from '../components/TutorialGuide';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [currentFilter, setCurrentFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
    const [quickAccessFilter, setQuickAccessFilter] = useState(null);
    const [showTutorial, setShowTutorial] = useState(false);
    const token = localStorage.getItem('token');
    const user = getUser();
    const navigate = useNavigate();

    const loadTasks = async () => {
        try {
            const res = await getTasks(token);
            // Ensure tasks is always an array, even if API returns null/undefined
            const tasksData = Array.isArray(res.data) ? res.data : [];
            setTasks(tasksData);
            applyFilter(tasksData, currentFilter);
        } catch (err) {
            toast.error('Failed to load tasks');
            setTasks([]); // Set empty array on error to prevent crashes
        } finally {
            setLoading(false);
        }
    };

    // Auto-start tutorial for new users
    useEffect(() => {
        const tutorialCompleted = localStorage.getItem('tutorialCompleted');
        if (!tutorialCompleted && !loading && tasks.length >= 0) {
            // Delay to let the page fully render
            setTimeout(() => {
                setShowTutorial(true);
            }, 1000);
        }
    }, [loading, tasks]);

    const applyFilter = (taskList, filter, query, quickFilter = null) => {
        let filtered = taskList;

        // Apply search query
        if (query) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(query.toLowerCase()) ||
                task.description.toLowerCase().includes(query.toLowerCase())
            );
        }

        // Apply quick access filters (Today, Important, Upcoming)
        if (quickFilter) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            switch (quickFilter) {
                case 'today':
                    filtered = filtered.filter(task => {
                        if (!task.dueDate) return false;
                        const taskDate = new Date(task.dueDate);
                        taskDate.setHours(0, 0, 0, 0);
                        return taskDate.getTime() === today.getTime();
                    });
                    break;
                case 'important':
                    filtered = filtered.filter(task => task.priority === 'High');
                    break;
                case 'upcoming':
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    nextWeek.setHours(23, 59, 59, 999);
                    filtered = filtered.filter(task => {
                        if (!task.dueDate) return false;
                        const taskDate = new Date(task.dueDate);
                        return taskDate >= today && taskDate <= nextWeek;
                    });
                    break;
                case 'date':
                    // Filter by specific date (from calendar)
                    if (filter && filter.date) {
                        const selectedDate = new Date(filter.date);
                        selectedDate.setHours(0, 0, 0, 0);
                        filtered = filtered.filter(task => {
                            if (!task.dueDate) return false;
                            const taskDate = new Date(task.dueDate);
                            taskDate.setHours(0, 0, 0, 0);
                            return taskDate.getTime() === selectedDate.getTime();
                        });
                    }
                    break;
                default:
                    break;
            }
        }

        // Apply standard filters (category, priority, status)
        if (filter && filter.type) {
            switch (filter.type) {
                case 'category':
                    filtered = filtered.filter(task => task.category === filter.value);
                    break;
                case 'priority':
                    filtered = filtered.filter(task => task.priority === filter.value);
                    break;
                case 'status':
                    filtered = filtered.filter(task => task.status === filter.value);
                    break;
                case 'completed':
                    filtered = filtered.filter(task => task.status === 'Completed');
                    break;
                case 'archived':
                    filtered = filtered.filter(task => task.archived === true);
                    break;
                case 'deleted':
                    filtered = filtered.filter(task => task.deleted === true);
                    break;
                default:
                    break;
            }
        }

        setFilteredTasks(filtered);
    };

    const handleFilterChange = (filter) => {
        setCurrentFilter(filter);
        setQuickAccessFilter(null);
        applyFilter(tasks, filter, searchQuery, null);
    };

    const clearFilter = () => {
        setCurrentFilter(null);
        setQuickAccessFilter(null);
        applyFilter(tasks, null, searchQuery, null);
    };

    // Quick access filter handlers
    const handleQuickAccess = (filterType) => {
        setQuickAccessFilter(filterType);
        setCurrentFilter(null);
        applyFilter(tasks, null, searchQuery, filterType);
    };

    const handleCalendarDateClick = (date) => {
        setQuickAccessFilter('date');
        setCurrentFilter({ date });
        applyFilter(tasks, { date }, searchQuery, 'date');
    };

    const handleCreateTaskFromCalendar = (date) => {
        setCurrentTask({
            title: '',
            description: '',
            priority: 'Medium',
            category: 'Work',
            status: 'To Do',
            dueDate: date.toISOString().split('T')[0]
        });
        setIsEditing(false);
        setIsModalOpen(true);
        setIsCalendarExpanded(false);
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
        const newStatus = task.status === 'Completed' ? 'To Do' : 'Completed';
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
            status: 'To Do',
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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        applyFilter(tasks, currentFilter, e.target.value, quickAccessFilter);
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

    useEffect(() => {
        applyFilter(tasks, currentFilter, searchQuery, quickAccessFilter);
    }, [tasks, currentFilter, quickAccessFilter]);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        margin: '20px auto',
                        maxWidth: '500px',
                        padding: '16px 24px',
                    },
                }}
            />
            <Sidebar
                isOpen={sidebarOpen}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                handleLogout={handleLogout}
                user={user}
                onQuickAccess={handleQuickAccess}
            />
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${sidebarOpen ? 'block' : 'hidden'} md:hidden`} onClick={() => setSidebarOpen(false)}></div>

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-10">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowTutorial(true)}
                                className="p-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors shadow-md hover:shadow-lg"
                                title="Start Tutorial"
                            >
                                <FaQuestionCircle size={20} />
                            </button>
                            <div className="relative">
                                <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search Tasks..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="pl-10 pr-4 py-2 border rounded-full w-64 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                                />
                            </div>
                            <Button onClick={openModalForCreate}>Create New Task</Button>
                        </div>
                    </header>

                    <div className="stats-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
                            <div>
                                <p className="text-gray-500">Total Tasks</p>
                                <p className="text-3xl font-bold text-gray-800">{tasks.filter(t => t.status === 'To Do').length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
                            <div>
                                <p className="text-gray-500">Completed</p>
                                <p className="text-3xl font-bold text-green-500">{tasks.filter(t => t.status === 'Completed').length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
                            <div>
                                <p className="text-gray-500">Pending</p>
                                <p className="text-3xl font-bold text-yellow-500">{tasks.filter(t => t.status !== 'Completed').length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
                            <div>
                                <p className="text-gray-500">Overdue</p>
                                <p className="text-3xl font-bold text-red-500">{
                                    tasks.filter(t =>
                                        t.dueDate &&
                                        new Date(t.dueDate) < new Date() &&
                                        t.status !== 'Completed'
                                    ).length
                                }</p>
                            </div>
                        </div>
                    </div>

                    {/* Calendar and Filters Side-by-Side Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Mini Calendar - Left Side */}
                        <div className="mini-calendar lg:col-span-1">
                            <Calendar
                                tasks={tasks}
                                onDateClick={handleCalendarDateClick}
                                onCreateTask={handleCreateTaskFromCalendar}
                                isExpanded={isCalendarExpanded}
                                onToggleExpanded={() => setIsCalendarExpanded(!isCalendarExpanded)}
                            />
                        </div>

                        {/* Filters - Right Side */}
                        <div className="filter-section lg:col-span-2 flex flex-col gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Category Filter */}
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                        onChange={(e) => handleFilterChange({ type: 'category', value: e.target.value })}
                                        value={currentFilter?.type === 'category' ? currentFilter.value : ''}
                                    >
                                        <option value="">All Categories</option>
                                        {['Work', 'Personal', 'Shopping', 'Health & Fitness', 'Home', 'Finance', 'Education', 'Social'].map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Priority Filter */}
                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority
                                    </label>
                                    <select
                                        id="priority"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                        onChange={(e) => handleFilterChange({ type: 'priority', value: e.target.value })}
                                        value={currentFilter?.type === 'priority' ? currentFilter.value : ''}
                                    >
                                        <option value="">All Priorities</option>
                                        {['High', 'Medium', 'Low'].map(priority => (
                                            <option key={priority} value={priority}>{priority}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                        onChange={(e) => handleFilterChange({ type: 'status', value: e.target.value })}
                                        value={currentFilter?.type === 'status' ? currentFilter.value : ''}
                                    >
                                        <option value="">All Statuses</option>
                                        {['To Do', 'In Progress', 'Completed'].map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Filtered By Card */}
                            {currentFilter && (
                                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-600">Filtered by:</span>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                                            {currentFilter.type}: {currentFilter.value}
                                        </span>
                                    </div>
                                    <Button
                                        onClick={clearFilter}
                                        variant="secondary"
                                        className="text-sm"
                                    >
                                        Clear All Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Detailed Statistics Widgets */}
                    <div className="detailed-stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Category Breakdown */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">📁 Tasks by Category</h3>
                            <div className="space-y-3">
                                {['Work', 'Personal', 'Shopping', 'Health', 'Other'].map(category => {
                                    const count = tasks.filter(t => t.category === category).length;
                                    const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
                                    return (
                                        <div key={category}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">{category}</span>
                                                <span className="font-semibold text-gray-800">{count}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Priority Distribution */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 Priority Levels</h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'High', color: 'bg-red-500', textColor: 'text-red-600' },
                                    { name: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
                                    { name: 'Low', color: 'bg-green-500', textColor: 'text-green-600' }
                                ].map(priority => {
                                    const count = tasks.filter(t => t.priority === priority.name).length;
                                    const completed = tasks.filter(t => t.priority === priority.name && t.status === 'Completed').length;
                                    return (
                                        <div key={priority.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${priority.color}`}></div>
                                                <span className="text-sm text-gray-700">{priority.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-semibold ${priority.textColor}`}>
                                                    {completed}/{count}
                                                </span>
                                                <span className="text-xs text-gray-500">tasks</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Status Overview */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Overall Progress</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Completion Rate</span>
                                        <span className="font-bold text-green-600">
                                            {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-100">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-500">{tasks.filter(t => t.status === 'To Do').length}</div>
                                            <div className="text-xs text-gray-500">To Do</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-500">{tasks.filter(t => t.status === 'In Progress').length}</div>
                                            <div className="text-xs text-gray-500">In Progress</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-500">{tasks.filter(t => t.status === 'Completed').length}</div>
                                            <div className="text-xs text-gray-500">Done</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="task-list space-y-4">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => (
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

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this task? This action cannot be undone."
            />

            <TaskModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={async (e, taskData) => {
                    e.preventDefault();
                    const toastId = toast.loading(isEditing ? 'Updating task...' : 'Creating task...');
                    try {
                        if (isEditing) {
                            await updateTask(currentTask._id, taskData, token);
                        } else {
                            await createTask(taskData, token);
                        }
                        loadTasks();
                        closeModal();
                        toast.success(isEditing ? 'Task updated successfully!' : 'Task created successfully!', { id: toastId });
                    } catch (err) {
                        toast.error(isEditing ? 'Error updating task' : 'Error creating task', { id: toastId });
                    }
                }}
                task={currentTask}
                isEditing={isEditing}
            />

            {/* Tutorial Guide */}
            <TutorialGuide
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
            />
        </div>
    );
}
