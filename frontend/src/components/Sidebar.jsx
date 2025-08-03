import { FaTasks, FaUserCircle, FaChevronLeft, FaChevronRight, FaSignOutAlt, FaUsers, FaChartLine, FaCalendarAlt, FaStar, FaBell, FaFolder } from 'react-icons/fa';

const Sidebar = ({ isOpen, isExpanded, setIsExpanded, handleLogout, user }) => {
    const sidebarClasses = `bg-black text-white flex flex-col justify-between min-h-screen p-4 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative ${isExpanded ? 'w-80' : 'w-20'}`;

    const sectionTitleClasses = "text-yellow-500 font-semibold text-sm uppercase tracking-wider mt-6 mb-2 px-2";
    const featureItemClasses = "flex items-start p-3 text-gray-300 rounded-lg hover:bg-gray-800 group transition-colors";
    const featureIconClasses = "text-yellow-500 mt-0.5 mr-3 flex-shrink-0";
    const featureTextClasses = "text-left";
    const featureTitleClasses = "font-medium text-white";
    const featureDescClasses = "text-sm text-gray-400 mt-1";

    return (
        <aside className={sidebarClasses}>
            <div className="overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
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

                <nav>
                    {isExpanded ? (
                        <>
                            <div className="mb-6">
                                <h3 className={sectionTitleClasses}>Features</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className={featureItemClasses}>
                                            <FaTasks size={18} className={featureIconClasses} />
                                            <div className={featureTextClasses}>
                                                <h4 className={featureTitleClasses}>Task Management</h4>
                                                <p className={featureDescClasses}>
                                                    Easily create, organize, and prioritize your tasks.
                                                </p>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className={featureItemClasses}>
                                            <FaUsers size={18} className={featureIconClasses} />
                                            <div className={featureTextClasses}>
                                                <h4 className={featureTitleClasses}>Collaboration</h4>
                                                <p className={featureDescClasses}>
                                                    Share tasks and projects with your team members.
                                                </p>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className={featureItemClasses}>
                                            <FaChartLine size={18} className={featureIconClasses} />
                                            <div className={featureTextClasses}>
                                                <h4 className={featureTitleClasses}>Analytics</h4>
                                                <p className={featureDescClasses}>
                                                    Track your productivity with detailed insights.
                                                </p>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h3 className={sectionTitleClasses}>Quick Access</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#today" className={featureItemClasses}>
                                            <FaCalendarAlt size={18} className={featureIconClasses} />
                                            <div className={featureTextClasses}>
                                                <h4 className={featureTitleClasses}>Today's Tasks</h4>
                                                <p className={featureDescClasses}>
                                                    View and manage tasks due today.
                                                </p>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#important" className={featureItemClasses}>
                                            <FaStar size={18} className={featureIconClasses} />
                                            <div className={featureTextClasses}>
                                                <h4 className={featureTitleClasses}>Important</h4>
                                                <p className={featureDescClasses}>
                                                    High priority tasks that need attention.
                                                </p>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#upcoming" className={featureItemClasses}>
                                            <FaBell size={18} className={featureIconClasses} />
                                            <div className={featureTextClasses}>
                                                <h4 className={featureTitleClasses}>Upcoming</h4>
                                                <p className={featureDescClasses}>
                                                    Tasks with approaching deadlines.
                                                </p>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#projects" className={featureItemClasses}>
                                            <FaFolder size={18} className={featureIconClasses} />
                                            <div className={featureTextClasses}>
                                                <h4 className={featureTitleClasses}>Projects</h4>
                                                <p className={featureDescClasses}>
                                                    Organize tasks by projects.
                                                </p>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center space-y-4 pt-4">
                            <a href="#" className="p-3 text-gray-400 hover:text-yellow-500 transition-colors" title="Task Management">
                                <FaTasks size={20} />
                            </a>
                            <a href="#" className="p-3 text-gray-400 hover:text-yellow-500 transition-colors" title="Collaboration">
                                <FaUsers size={20} />
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
                            <a href="#projects" className="p-3 text-gray-400 hover:text-yellow-500 transition-colors" title="Projects">
                                <FaFolder size={20} />
                            </a>
                        </div>
                    )}
                </nav>
            </div>

            <div className={`mt-auto ${!isExpanded ? 'flex justify-center' : ''}`}>
                <button
                    onClick={handleLogout}
                    className={`flex items-center p-3 text-gray-300 hover:bg-yellow-500 hover:text-black rounded-lg transition-colors ${isExpanded ? 'w-full' : ''}`}
                    title="Logout"
                >
                    <FaSignOutAlt size={20} className={!isExpanded ? 'mx-auto' : ''} />
                    {isExpanded && <span className="ml-3">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
