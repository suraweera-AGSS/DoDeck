import { useEffect, useState } from 'react';
import { getTasks, createTask, deleteTask } from '../services/task';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [text, setText] = useState('');
    const token = localStorage.getItem('token');

    const loadTasks = async () => {
        try {
            const res = await getTasks(token);
            setTasks(res.data);
        } catch (err) {
            alert('Failed to load tasks');
        }
    };

    const handleAdd = async () => {
        if (!text.trim()) return;
        try {
            await createTask({ text }, token);
            setText('');
            loadTasks();
        } catch (err) {
            alert('Error creating task');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTask(id, token);
            loadTasks();
        } catch (err) {
            alert('Error deleting task');
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
            <div className="flex mb-4">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="New Task"
                />
                <button onClick={handleAdd} className="ml-2 px-4 bg-green-600 text-white rounded">
                    Add
                </button>
            </div>
            <ul>
                {tasks.map((task) => (
                    <li key={task._id} className="flex justify-between items-center mb-2 p-2 border rounded">
                        <span>{task.text}</span>
                        <button
                            onClick={() => handleDelete(task._id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
