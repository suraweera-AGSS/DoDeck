import { FaInbox, FaStar, FaTasks, FaArchive, FaUserCircle, FaChevronLeft, FaChevronRight, FaSignOutAlt, FaCheckCircle, FaTrash, FaClock, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useState } from 'react';

export default function Sidebar({ isOpen, isExpanded, setIsExpanded, handleLogout, user }) {
  const [expandedMenus, setExpandedMenus] = useState({});
  
  const sidebarClasses = `bg-black text-white flex flex-col justify-between min-h-screen p-4 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative ${isExpanded ? 'w-64' : 'w-20'}`;

  const linkClasses = "flex items-center p-2 text-base font-normal text-gray-300 rounded-lg hover:bg-yellow-500 hover:text-black group";
  const iconClasses = "text-gray-400 group-hover:text-black transition-all duration-300";
  const textClasses = "ml-3 transition-opacity duration-200";
  const subItemClasses = "flex items-center p-2 pl-12 text-sm font-normal text-gray-400 rounded-lg hover:bg-gray-700 hover:text-gray-200";

  const toggleMenu = (menuName) => {
    if (isExpanded) {
      setExpandedMenus(prev => ({
        ...prev,
        [menuName]: !prev[menuName]
      }));
    }
  };

  const categoryOptions = ['Work', 'Personal', 'Shopping', 'Health & Fitness', 'Home', 'Finance', 'Education', 'Social'];
  const priorityOptions = ['High', 'Medium', 'Low'];
  const statusOptions = ['To do', 'In Progress', 'Completed'];

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
            {/* Category with dropdown */}
            <li className="mb-2">
              <button 
                onClick={() => toggleMenu('category')} 
                className={`${linkClasses} w-full ${!isExpanded ? 'justify-center' : ''}`}
              >
                <FaInbox size={20} className={iconClasses} />
                {isExpanded && (
                  <>
                    <span className={`${textClasses} flex-1 text-left`}>Category</span>
                    {expandedMenus.category ? 
                      <FaChevronUp size={12} className={iconClasses} /> : 
                      <FaChevronDown size={12} className={iconClasses} />
                    }
                  </>
                )}
              </button>
              {isExpanded && expandedMenus.category && (
                <ul className="mt-1 space-y-1">
                  {categoryOptions.map((option) => (
                    <li key={option}>
                      <a href="#" className={subItemClasses}>
                        {option}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Priority with dropdown */}
            <li className="mb-2">
              <button 
                onClick={() => toggleMenu('priority')} 
                className={`${linkClasses} w-full ${!isExpanded ? 'justify-center' : ''}`}
              >
                <FaStar size={20} className={iconClasses} />
                {isExpanded && (
                  <>
                    <span className={`${textClasses} flex-1 text-left`}>Priority</span>
                    {expandedMenus.priority ? 
                      <FaChevronUp size={12} className={iconClasses} /> : 
                      <FaChevronDown size={12} className={iconClasses} />
                    }
                  </>
                )}
              </button>
              {isExpanded && expandedMenus.priority && (
                <ul className="mt-1 space-y-1">
                  {priorityOptions.map((option) => (
                    <li key={option}>
                      <a href="#" className={subItemClasses}>
                        {option}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Status with dropdown */}
            <li className="mb-2">
              <button 
                onClick={() => toggleMenu('status')} 
                className={`${linkClasses} w-full ${!isExpanded ? 'justify-center' : ''}`}
              >
                <FaTasks size={20} className={iconClasses} />
                {isExpanded && (
                  <>
                    <span className={`${textClasses} flex-1 text-left`}>Status</span>
                    {expandedMenus.status ? 
                      <FaChevronUp size={12} className={iconClasses} /> : 
                      <FaChevronDown size={12} className={iconClasses} />
                    }
                  </>
                )}
              </button>
              {isExpanded && expandedMenus.status && (
                <ul className="mt-1 space-y-1">
                  {statusOptions.map((option) => (
                    <li key={option}>
                      <a href="#" className={subItemClasses}>
                        {option}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Non-dropdown items */}
            <li className="mb-4">
              <a href="#" className={`${linkClasses} ${!isExpanded ? 'justify-center' : ''}`}>
                <FaArchive size={20} className={iconClasses} />
                {isExpanded && <span className={`${textClasses}`}>Archived Tasks</span>}
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className={`${linkClasses} ${!isExpanded ? 'justify-center' : ''}`}>
                <FaCheckCircle size={20} className={iconClasses} />
                {isExpanded && <span className={`${textClasses}`}>Completed Tasks</span>}
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className={`${linkClasses} ${!isExpanded ? 'justify-center' : ''}`}>
                <FaClock size={20} className={iconClasses} />
                {isExpanded && <span className={`${textClasses}`}>Incomplete Tasks</span>}
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className={`${linkClasses} ${!isExpanded ? 'justify-center' : ''}`}>
                <FaTrash size={20} className={iconClasses} />
                {isExpanded && <span className={`${textClasses}`}>Deleted Tasks</span>}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <nav>
        <ul>
          <li>
            <button onClick={handleLogout} className={`flex items-center p-2 text-base font-normal text-gray-300 rounded-lg hover:bg-red-500 hover:text-white group w-full ${!isExpanded ? 'justify-center' : ''}`}>
              <FaSignOutAlt size={20} className="text-gray-400 group-hover:text-white transition-all duration-300" />
              {isExpanded && <span className={`${textClasses}`}>Sign out</span>}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
