import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

export default function Login() {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ loginId, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80">
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
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
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
                    Login
                </button>
                <p className="mt-3 text-sm text-center">
                    Don’t have an account?{' '}
                    <a href="/register" className="text-blue-500">
                        Register
                    </a>
                </p>
            </form>
        </div>
    );
}
