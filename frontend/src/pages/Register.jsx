import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';

export default function Register() {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register({ loginId, password });
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Register failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow w-80">
                <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
                <input
                    type="text"
                    placeholder="Login ID"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
}
