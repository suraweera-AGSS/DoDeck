import { FaInbox, FaStar, FaTasks, FaArchive, FaUserCircle, FaChevronLeft, FaChevronRight, FaSignOutAlt, FaCheckCircle, FaTrash, FaClock } from 'react-icons/fa';

export default function Sidebar({ isOpen, isExpanded, setIsExpanded, handleLogout, user }) {
  const sidebarClasses = `bg-black text-white flex flex-col justify-between min-h-screen p-4 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative ${isExpanded ? 'w-64' : 'w-20'}`;

  const linkClasses = "flex items-center p-2 text-base font-normal text-gray-300 rounded-lg hover:bg-yellow-500 hover:text-black group";
  const iconClasses = "text-gray-400 group-hover:text-black transition-all duration-300";
  const textClasses = "ml-3 transition-opacity duration-200";

  return (
    <aside className={sidebarClasses}>
      <div>
        <div className="flex items-center justify-between mb-10">
          <div className={`flex items-center ${!isExpanded && 'w-full justify-center'}`}>
            {isExpanded && <FaUserCircle size={40} className="mr-3 text-yellow-500" />}
            {isExpanded && (
              <div>
                <p className="font-bold">{user?.loginId || 'User'}</p>
              </div>
            )}
          </div>
          <button onClick={() => setIsExpanded(!isExpanded)} className={`p-2 rounded-full bg-gray-800 hover:bg-yellow-500 hover:text-black absolute top-5 ${isExpanded ? 'right-5' : 'left-1/2 -translate-x-1/2'}`}>
            {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#" className={`${linkClasses} ${!isExpanded && 'justify-center'}`}>
                <FaInbox size={20} className={iconClasses} />
                <span className={`${textClasses} ${!isExpanded && 'opacity-0'}`}>Category</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className={`${linkClasses} ${!isExpanded && 'justify-center'}`}>
                <FaStar size={20} className={iconClasses} />
                <span className={`${textClasses} ${!isExpanded && 'opacity-0'}`}>Priority</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className={`${linkClasses} ${!isExpanded && 'justify-center'}`}>
                <FaTasks size={20} className={iconClasses} />
                <span className={`${textClasses} ${!isExpanded && 'opacity-0'}`}>Status</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className={`${linkClasses} ${!isExpanded && 'justify-center'}`}>
                <FaArchive size={20} className={iconClasses} />
                <span className={`${textClasses} ${!isExpanded && 'opacity-0'}`}>Archived Tasks</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className={`${linkClasses} ${!isExpanded && 'justify-center'}`}>
                <FaCheckCircle size={20} className={iconClasses} />
                <span className={`${textClasses} ${!isExpanded && 'opacity-0'}`}>Completed Tasks</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className={`${linkClasses} ${!isExpanded && 'justify-center'}`}>
                <FaClock size={20} className={iconClasses} />
                <span className={`${textClasses} ${!isExpanded && 'opacity-0'}`}>Incomplete Tasks</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className={`${linkClasses} ${!isExpanded && 'justify-center'}`}>
                <FaTrash size={20} className={iconClasses} />
                <span className={`${textClasses} ${!isExpanded && 'opacity-0'}`}>Deleted Tasks</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <nav>
        <ul>
          <li>
            <button onClick={handleLogout} className={`${linkClasses} w-full ${!isExpanded && 'justify-center'}`}>
              <FaSignOutAlt size={20} className={iconClasses} />
              <span className={`${textClasses} ${!isExpanded && 'opacity-0'}`}>Sign out</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}


