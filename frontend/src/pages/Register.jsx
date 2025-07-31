import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '../components/Button';

export default function Register() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ loginId, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{backgroundColor: '#F5F5F5'}}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-black">Create Account</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="loginId">
              Login ID
            </label>
            <input
              type="text"
              id="loginId"
              placeholder="Choose a Login ID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <Button type="submit" variant="accent" className="w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/" className="text-black font-medium hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
