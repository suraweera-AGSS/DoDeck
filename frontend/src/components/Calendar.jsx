import { useState, useMemo } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Calendar = ({ tasks, onDateClick, onCreateTask, isExpanded, onToggleExpanded }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const getTaskCountForDate = (date) => {
        if (!tasks || !Array.isArray(tasks)) return 0;

        const dateStr = new Date(date).toDateString();
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate).toDateString();
            return taskDate === dateStr;
        }).length;
    };

    const getTasksForDate = (date) => {
        if (!tasks || !Array.isArray(tasks)) return [];

        const dateStr = new Date(date).toDateString();
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate).toDateString();
            return taskDate === dateStr;
        });
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(year, month, day);
        setSelectedDate(clickedDate);
        if (onDateClick) onDateClick(clickedDate);
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
    };

    const isSelected = (day) => {
        if (!selectedDate) return false;
        return day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear();
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

    // Mini Calendar View
    if (!isExpanded) {
        return (
            <div className="bg-white rounded-2xl shadow-md p-3">
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={previousMonth}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaChevronLeft size={10} />
                    </button>
                    <span className="text-xs font-bold text-gray-700">
                        {monthNames[month].slice(0, 3)} {year}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaChevronRight size={10} />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-0.5 mb-1">
                    {dayNames.map(day => (
                        <div key={day} className="text-center text-[8px] font-semibold text-gray-400">
                            {day.charAt(0)}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-0.5">
                    {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square"></div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const taskCount = getTaskCountForDate(new Date(year, month, day));
                        const isTodayDate = isToday(day);
                        const isSelectedDate = isSelected(day);

                        return (
                            <button
                                key={day}
                                onClick={() => handleDateClick(day)}
                                onDoubleClick={onToggleExpanded}
                                className={`aspect-square rounded text-[10px] font-medium transition-all relative flex items-center justify-center
                                    ${isTodayDate ? 'bg-yellow-500 text-white' : ''}
                                    ${isSelectedDate && !isTodayDate ? 'bg-yellow-200 text-gray-800' : ''}
                                    ${!isTodayDate && !isSelectedDate ? 'hover:bg-gray-100 text-gray-600' : ''}
                                `}
                            >
                                {day}
                                {taskCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[7px] rounded-full w-2.5 h-2.5 flex items-center justify-center">
                                        {taskCount > 9 ? '9+' : taskCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={onToggleExpanded}
                    className="w-full mt-2 py-1 text-xs bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                >
                    Expand
                </button>
            </div>
        );
    }

    // Full-Screen Calendar View
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">Task Calendar</h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={previousMonth}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FaChevronLeft size={18} />
                            </button>
                            <span className="text-lg font-semibold text-gray-700 min-w-[200px] text-center">
                                {monthNames[month]} {year}
                            </span>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FaChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={onToggleExpanded}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Calendar Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Calendar Grid */}
                    <div className="flex-1 p-6">
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {dayNames.map(day => (
                                <div key={day} className="text-center text-sm font-bold text-gray-600 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2 h-[calc(100%-60px)]">
                            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                                <div key={`empty-${i}`} className="border rounded-lg bg-gray-50"></div>
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const taskCount = getTaskCountForDate(new Date(year, month, day));
                                const isTodayDate = isToday(day);
                                const isSelectedDate = isSelected(day);

                                return (
                                    <button
                                        key={day}
                                        onClick={() => handleDateClick(day)}
                                        className={`border rounded-lg p-2 text-left transition-all relative min-h-[100px]
                                            ${isTodayDate ? 'border-yellow-500 border-2' : 'border-gray-200'}
                                            ${isSelectedDate ? 'bg-yellow-50 border-yellow-400' : 'hover:bg-gray-50'}
                                        `}
                                    >
                                        <span className={`text-sm font-bold ${isTodayDate ? 'text-yellow-600' : 'text-gray-700'}`}>
                                            {day}
                                        </span>
                                        {taskCount > 0 && (
                                            <div className="mt-1">
                                                <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                                    {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Selected Date Tasks */}
                    <div className="w-96 border-l p-6 overflow-y-auto bg-gray-50">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            {selectedDate ? selectedDate.toDateString() : 'Select a date'}
                        </h3>

                        {selectedDate && (
                            <button
                                onClick={() => onCreateTask && onCreateTask(selectedDate)}
                                className="w-full mb-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                            >
                                + Add Task on {selectedDate.toLocaleDateString()}
                            </button>
                        )}

                        <div className="space-y-3">
                            {selectedDateTasks.length > 0 ? (
                                selectedDateTasks.map(task => (
                                    <div key={task._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <h4 className="font-semibold text-gray-800">{task.title}</h4>
                                        {task.description && (
                                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {task.priority}
                                            </span>
                                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                                {task.category}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                selectedDate && (
                                    <p className="text-gray-500 text-sm text-center py-8">
                                        No tasks scheduled for this date
                                    </p>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
