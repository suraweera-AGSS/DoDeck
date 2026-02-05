import { Link } from 'react-router-dom';
import { FaTasks, FaUserCircle, FaChevronLeft, FaChevronRight, FaSignOutAlt, FaUsers, FaChartLine, FaCalendarAlt, FaStar, FaBell, FaFolder } from 'react-icons/fa';

const Sidebar = ({ isOpen, isExpanded, setIsExpanded, handleLogout, user, onQuickAccess }) => {
    const sidebarClasses = `bg-black text-white flex flex-col h-screen p-4 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative ${isExpanded ? 'w-80' : 'w-20'}`;

    const sectionTitleClasses = "text-yellow-500 font-semibold text-sm uppercase tracking-wider mt-6 mb-2 px-2";
    const featureItemClasses = "flex items-start p-3 text-gray-300 rounded-lg hover:bg-gray-800 group transition-colors";
    const featureIconClasses = "text-yellow-500 mt-0.5 mr-3 flex-shrink-0";
    const featureTextClasses = "text-left";
    const featureTitleClasses = "font-medium text-white";
    const featureDescClasses = "text-sm text-gray-400 mt-1";

    return (
        <aside className={sidebarClasses}>
            {/* Top section with user info & toggle*/}
            <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    {isExpanded && (
                        <div className="flex items-center">
                            <FaUserCircle size={35} className="mr-3 text-yellow-500" />
                            <div>
                                <p className="font-bold text-white">{user?.loginId || 'User'}</p>
                                <p className="text-sm text-gray-400">{user?.email || ''}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`p-2 rounded-full bg-gray-800 hover:bg-yellow-500 hover:text-black transition-colors ${isExpanded ? 'ml-auto' : 'mx-auto'}`}
                    >
                        {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
                    </button>
                </div>
            </div>

            {/* Scrollable navigation section */}
            <nav className="flex-1 overflow-y-auto scrollbar-hide">
                {isExpanded ? (
                    <>
                        <div className="mb-6">
                            <h3 className={sectionTitleClasses}>Navigation</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/dashboard" className={featureItemClasses}>
                                        <FaFolder size={18} className={featureIconClasses} />
                                        <div className={featureTextClasses}>
                                            <h4 className={featureTitleClasses}>Dashboard</h4>
                                            <p className={featureDescClasses}>
                                                Overview of all your tasks and activities.
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/tasks" className={featureItemClasses}>
                                        <FaTasks size={18} className={featureIconClasses} />
                                        <div className={featureTextClasses}>
                                            <h4 className={featureTitleClasses}>Task Management</h4>
                                            <p className={featureDescClasses}>
                                                Easily create, organize, and prioritize your tasks.
                                            </p>
                                        </div>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/analytics" className={featureItemClasses}>
                                        <FaChartLine size={18} className={featureIconClasses} />
                                        <div className={featureTextClasses}>
                                            <h4 className={featureTitleClasses}>Analytics</h4>
                                            <p className={featureDescClasses}>
                                                Track your productivity with detailed insights.
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </div>


                        <div className="sidebar-features mb-6">
                            <h3 className={sectionTitleClasses}>Quick Access</h3>
                            <ul className="space-y-2">
                                <li>
                                    <button onClick={() => onQuickAccess && onQuickAccess('today')} className={featureItemClasses + ' w-full text-left'}>
                                        <FaCalendarAlt size={18} className={featureIconClasses} />
                                        <div className={featureTextClasses}>
                                            <h4 className={featureTitleClasses}>Today's Tasks</h4>
                                            <p className={featureDescClasses}>
                                                View and manage tasks due today.
                                            </p>
                                        </div>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onQuickAccess && onQuickAccess('important')} className={featureItemClasses + ' w-full text-left'}>
                                        <FaStar size={18} className={featureIconClasses} />
                                        <div className={featureTextClasses}>
                                            <h4 className={featureTitleClasses}>Important</h4>
                                            <p className={featureDescClasses}>
                                                High priority tasks that need attention.
                                            </p>
                                        </div>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onQuickAccess && onQuickAccess('upcoming')} className={featureItemClasses + ' w-full text-left'}>
                                        <FaBell size={18} className={featureIconClasses} />
                                        <div className={featureTextClasses}>
                                            <h4 className={featureTitleClasses}>Upcoming</h4>
                                            <p className={featureDescClasses}>
                                                Tasks with approaching deadlines.
                                            </p>
                                        </div>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center space-y-4 pt-4">
                        <a href="#" className="p-3 text-gray-400 hover:text-yellow-500 transition-colors" title="Task Management">
                            <FaTasks size={20} />
                        </a>
                        <a href="#" className="p-3 text-gray-400 hover:text-yellow-500 transition-colors" title="Analytics">
                            <FaChartLine size={20} />
                        </a>
                        <a href="#today" className="p-3 text-gray-400 hover:text-yellow-500 transition-colors" title="Today">
                            <FaCalendarAlt size={20} />
                        </a>
                        <a href="#important" className="p-3 text-gray-400 hover:text-yellow-500 transition-colors" title="Important">
                            <FaStar size={20} />
                        </a>
                        <a href="#upcoming" className="p-3 text-gray-400 hover:text-yellow-500 transition-colors" title="Upcoming">
                            <FaBell size={20} />
                        </a>
                    </div>
                )}
                {/* Logout Button - Visible at the top */}
                <div className={`mb-4 ${!isExpanded ? 'flex justify-center' : ''}`}>
                    <button
                        onClick={handleLogout}
                        className={`flex items-center p-3 text-gray-300 hover:bg-yellow-500 hover:text-black rounded-lg transition-colors ${isExpanded ? 'w-full' : ''}`}
                        title="Logout"
                    >
                        <FaSignOutAlt size={20} className={!isExpanded ? 'mx-auto' : ''} />
                        {isExpanded && <span className="ml-3 font-medium">Logout</span>}
                    </button>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
