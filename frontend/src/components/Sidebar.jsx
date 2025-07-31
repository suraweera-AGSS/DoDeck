import { FaInbox, FaStar, FaTasks, FaArchive, FaUserCircle } from 'react-icons/fa';

export default function Sidebar({ isOpen }) {
  const sidebarClasses = `bg-black text-white w-64 min-h-screen p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative`;

  return (
    <aside className={sidebarClasses}>
      <div className="flex items-center mb-10">
        <FaUserCircle size={40} className="mr-3" />
        <div>
          <p className="font-bold">User Name</p>
          <p className="text-sm text-gray-400">user@email.com</p>
        </div>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <a href="#" className="flex items-center p-2 text-base font-normal text-gray-300 rounded-lg hover:bg-gray-700">
              <FaInbox className="mr-3" />
              <span>Category</span>
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="flex items-center p-2 text-base font-normal text-gray-300 rounded-lg hover:bg-gray-700">
              <FaStar className="mr-3" />
              <span>Priority</span>
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="flex items-center p-2 text-base font-normal text-gray-300 rounded-lg hover:bg-gray-700">
              <FaTasks className="mr-3" />
              <span>Status</span>
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="flex items-center p-2 text-base font-normal text-gray-300 rounded-lg hover:bg-gray-700">
              <FaArchive className="mr-3" />
              <span>Archived</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
