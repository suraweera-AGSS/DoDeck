import { FaTasks, FaUserCircle, FaChevronLeft, FaChevronRight, FaSignOutAlt, FaCheckCircle, FaArchive, FaTrashAlt } from 'react-icons/fa';

const Sidebar = ({ isOpen, isExpanded, setIsExpanded, handleLogout, user }) => {
    const sidebarClasses = `bg-black text-white flex flex-col justify-between min-h-screen p-4 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative ${isExpanded ? 'w-64' : 'w-20'}`;

    const linkClasses = "flex items-center p-2 text-base font-normal text-gray-300 rounded-lg hover:bg-yellow-500 hover:text-black group";
    const iconClasses = "text-gray-400 group-hover:text-black transition-all duration-300";
    const textClasses = "ml-3 transition-opacity duration-200";

    return (
        <aside className={sidebarClasses}>
            <div>
                <div className="flex items-center justify-between mb-10">
                    <div className={`flex items-center`}>
                        {isExpanded ? (
                            <div className="flex items-center w-full">
                                <FaUserCircle size={35} className="mr-3 text-yellow-500" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold truncate">{user?.loginId || 'User'}</p>
                                    <p className="text-sm text-gray-400 truncate">{user?.email || ''}</p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`p-2 rounded-full bg-gray-800 hover:bg-yellow-500 hover:text-black absolute top-3 ${isExpanded ? 'right-6' : 'left-1/2 -translate-x-1/2'}`}
                    >
                        {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
                    </button>
                </div>

                <nav>
                    <ul>
                        <li className="mb-4">
                            <button
                                className={`${linkClasses} ${!isExpanded ? 'justify-center' : 'w-full'}`}
                                title="All Tasks"
                            >
                                <FaTasks size={20} className={iconClasses} />
                                {isExpanded && <span className={textClasses}>All Tasks</span>}
                            </button>
                            <button
                                className={`${linkClasses} ${!isExpanded ? 'justify-center' : 'w-full'}`}
                                title="Completed Tasks"
                            >
                                <FaCheckCircle size={20} className={iconClasses} />
                                {isExpanded && <span className={textClasses}>Completed Tasks</span>}
                            </button>
                            <button
                                className={`${linkClasses} ${!isExpanded ? 'justify-center' : 'w-full'}`}
                                title="Archived Tasks"
                            >
                                <FaArchive size={20} className={iconClasses} />
                                {isExpanded && <span className={textClasses}>Archived Tasks</span>}
                            </button>
                            <button
                                className={`${linkClasses} ${!isExpanded ? 'justify-center' : 'w-full'}`}
                                title="Deleted Tasks"
                            >
                                <FaTrashAlt size={20} className={iconClasses} />
                                {isExpanded && <span className={textClasses}>Deleted Tasks</span>}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            <div>
                <button
                    onClick={handleLogout}
                    className={`${linkClasses} ${!isExpanded ? 'justify-center' : 'w-full'}`}
                >
                    <FaSignOutAlt size={20} className={iconClasses} />
                    {isExpanded && <span className={textClasses}>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
