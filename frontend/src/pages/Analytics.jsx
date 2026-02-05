import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks } from '../services/task';
import { getUser } from '../services/auth';
import { FaChartLine, FaTasks, FaFire, FaTrophy, FaArrowLeft } from 'react-icons/fa';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import Sidebar from '../components/Sidebar';

export default function Analytics() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
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

    const loadTasks = async () => {
        try {
            const data = await getTasks(token);
            setTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    // Analytics calculations
    const completionRate = tasks.length > 0
        ? ((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100).toFixed(1)
        : 0;

    const currentStreak = 7; // Placeholder - would calculate from task completion dates
    const totalPoints = tasks.filter(t => t.status === 'Completed').length * 10;

    // Priority distribution
    const priorityData = [
        { name: 'High', value: tasks.filter(t => t.priority === 'High').length, color: '#EF4444' },
        { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length, color: '#F59E0B' },
        { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length, color: '#10B981' }
    ];

    // Category distribution
    const categoryData = [
        { name: 'Work', value: tasks.filter(t => t.category === 'Work').length },
        { name: 'Personal', value: tasks.filter(t => t.category === 'Personal').length },
        { name: 'Shopping', value: tasks.filter(t => t.category === 'Shopping').length },
        { name: 'Health', value: tasks.filter(t => t.category === 'Health').length },
        { name: 'Other', value: tasks.filter(t => t.category === 'Other').length }
    ];

    // Task completion trend (last 7 days)
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const completedCount = tasks.filter(t => {
                if (!t.updatedAt || t.status !== 'Completed') return false;
                const taskDate = new Date(t.updatedAt);
                return taskDate.toDateString() === date.toDateString();
            }).length;

            days.push({
                day: dayName,
                completed: completedCount,
                created: Math.floor(Math.random() * 5) // Placeholder
            });
        }
        return days;
    };

    const weeklyTrend = getLast7Days();

    // Status distribution
    const statusData = [
        { name: 'To Do', value: tasks.filter(t => t.status === 'To Do').length },
        { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
        { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length }
    ];

    const CATEGORY_COLORS = ['#EAB308', '#3B82F6', '#10B981', '#F59E0B', '#6B7280'];
    const STATUS_COLORS = ['#EAB308', '#3B82F6', '#10B981'];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-2xl text-gray-600">Loading analytics...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
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
                    <header className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 hover:bg-white rounded-full transition-colors"
                            >
                                <FaArrowLeft size={20} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">📊 Analytics Dashboard</h1>
                                <p className="text-gray-500">Track your productivity and insights</p>
                            </div>
                        </div>
                    </header>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-2xl shadow-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100 text-sm">Completion Rate</p>
                                    <p className="text-4xl font-bold mt-2">{completionRate}%</p>
                                    <p className="text-yellow-100 text-xs mt-2">
                                        {tasks.filter(t => t.status === 'Completed').length} of {tasks.length} tasks
                                    </p>
                                </div>
                                <FaChartLine size={40} className="text-yellow-200" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-400 to-red-500 p-6 rounded-2xl shadow-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm">Current Streak</p>
                                    <p className="text-4xl font-bold mt-2">{currentStreak} days</p>
                                    <p className="text-orange-100 text-xs mt-2">Keep it going! 🔥</p>
                                </div>
                                <FaFire size={40} className="text-orange-200" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-400 to-blue-500 p-6 rounded-2xl shadow-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Total Points</p>
                                    <p className="text-4xl font-bold mt-2">{totalPoints}</p>
                                    <p className="text-green-100 text-xs mt-2">10 points per task</p>
                                </div>
                                <FaTrophy size={40} className="text-green-200" />
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Weekly Completion Trend */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Weekly Completion Trend</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={weeklyTrend}>
                                    <defs>
                                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="day" stroke="#6B7280" />
                                    <YAxis stroke="#6B7280" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="completed" stroke="#10B981" fillOpacity={1} fill="url(#colorCompleted)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Priority Distribution */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 Priority Distribution</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={priorityData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {priorityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Category Breakdown */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">📁 Category Breakdown</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="name" stroke="#6B7280" />
                                    <YAxis stroke="#6B7280" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#EAB308" radius={[8, 8, 0, 0]}>
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Status Overview */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">✅ Status Overview</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={statusData} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis type="number" stroke="#6B7280" />
                                    <YAxis dataKey="name" type="category" stroke="#6B7280" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#3B82F6" radius={[0, 8, 8, 0]}>
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Productivity Insights */}
                    <div className="mt-6 bg-white p-6 rounded-2xl shadow-md">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Productivity Insights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-600 font-semibold">Most Active Category</p>
                                <p className="text-2xl font-bold text-blue-800 mt-1">
                                    {categoryData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-600 font-semibold">Tasks Completed</p>
                                <p className="text-2xl font-bold text-green-800 mt-1">
                                    {tasks.filter(t => t.status === 'Completed').length}
                                </p>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-lg">
                                <p className="text-sm text-yellow-600 font-semibold">Average Priority</p>
                                <p className="text-2xl font-bold text-yellow-800 mt-1">
                                    {priorityData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
